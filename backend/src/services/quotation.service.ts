import {
  AdminAction,
  Prisma,
  QuoteConversationSenderType,
  QuoteConversationType,
  QuoteStatus
} from "@prisma/client";
import { env } from "../config/env";
import { sendMail } from "../config/mail";
import { AuthRepository } from "../repositories/auth.repository";
import { QuotationRepository, QuotationWithDetails } from "../repositories/quotation.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";
import { RequestMeta } from "./auth.service";

type CreateQuotationInput = {
  companyName?: string | null;
  companyWebsite?: string | null;
  contactPerson: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  source?: string | null;
  expectedDeliveryDate?: Date | null;
  estimatedBudget?: number | null;
  currency?: string | null;
  message?: string | null;
  items: Array<{
    propertyId?: string | null;
    categoryId?: string | null;
    unitId?: string | null;
    itemName: string;
    description?: string | null;
    quantity: number;
    sortOrder?: number;
  }>;
};

type QuotationListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: QuoteStatus;
  assignedToId?: string;
  email?: string;
  country?: string;
  createdFrom?: Date;
  createdTo?: Date;
  sortBy: "createdAt" | "updatedAt" | "lastActivityAt" | "requestNo" | "status" | "companyName";
  sortOrder: "asc" | "desc";
  includeDeleted: boolean;
  deletedOnly: boolean;
};

type AssignQuotationInput = {
  salesExecutiveId: string | null;
  note?: string;
};

type UpdateQuotationStatusInput = {
  status: QuoteStatus;
  note?: string;
  notifyCustomer?: boolean;
};

type UpdateQuotationInput = {
  internalNotes?: string | null;
  expectedDeliveryDate?: Date | null;
  estimatedBudget?: number | null;
  currency?: string | null;
};

type AddConversationInput = {
  message: string;
  conversationType?: QuoteConversationType;
  isInternal?: boolean;
  notifyCustomer?: boolean;
  metadata?: Record<string, unknown>;
};

const listInclude = {
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  items: {
    include: {
      property: true,
      category: true,
      unit: true
    },
    orderBy: { sortOrder: "asc" }
  },
  _count: {
    select: {
      conversations: true
    }
  }
} satisfies Prisma.QuotationRequestInclude;

export class QuotationService {
  constructor(
    private readonly quotationRepository = new QuotationRepository(),
    private readonly authRepository = new AuthRepository()
  ) {}

  async submit(input: CreateQuotationInput, meta: RequestMeta) {
    const quotation = await this.createWithUniqueNumber(input);
    const customerMessage = input.message?.trim() || "Quotation request submitted.";

    await this.quotationRepository.createConversation({
      quotationRequestId: quotation.id,
      senderType: QuoteConversationSenderType.CUSTOMER,
      conversationType: QuoteConversationType.MESSAGE,
      message: customerMessage,
      metadata: this.toJson({
        requestNo: quotation.requestNo,
        source: input.source
      })
    });

    await this.audit(null, AdminAction.QUOTATION_SUBMITTED, quotation, undefined, meta);
    await Promise.all([this.sendCustomerConfirmation(quotation), this.notifyAdmins(quotation)]);

    return {
      id: quotation.id,
      requestNo: quotation.requestNo,
      status: quotation.status,
      createdAt: quotation.createdAt
    };
  }

  async list(query: QuotationListQuery) {
    const where = this.buildWhere(query);
    const skip = (query.page - 1) * query.limit;
    const orderBy = { [query.sortBy]: query.sortOrder };

    const [items, total] = await Promise.all([
      this.quotationRepository.findMany({
        where,
        include: listInclude,
        orderBy,
        skip,
        take: query.limit
      }),
      this.quotationRepository.count(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async stats() {
    const counts = await this.quotationRepository.statusCounts();
    return Object.values(QuoteStatus).reduce<Record<string, number>>((acc, status) => {
      acc[status] = counts.find((item) => item.status === status)?._count.status ?? 0;
      return acc;
    }, {});
  }

  async get(id: string) {
    const quotation = await this.quotationRepository.findById(id);
    if (!quotation || quotation.deletedAt) {
      throw new AppError("Quotation was not found", 404);
    }

    return quotation;
  }

  async update(id: string, input: UpdateQuotationInput, actorId: string, meta: RequestMeta) {
    const before = await this.get(id);
    const quotation = await this.quotationRepository.update(id, {
      internalNotes: input.internalNotes,
      expectedDeliveryDate: input.expectedDeliveryDate,
      estimatedBudget: input.estimatedBudget,
      currency: input.currency,
      lastActivityAt: new Date()
    });

    await this.audit(actorId, AdminAction.UPDATE, quotation, before, meta);
    return quotation;
  }

  async assign(id: string, input: AssignQuotationInput, actorId: string, meta: RequestMeta) {
    const before = await this.get(id);

    if (input.salesExecutiveId) {
      await this.assertSalesExecutive(input.salesExecutiveId);
    }

    const quotation = await this.quotationRepository.update(id, {
      assignedTo: input.salesExecutiveId ? { connect: { id: input.salesExecutiveId } } : { disconnect: true },
      assignedAt: input.salesExecutiveId ? new Date() : null,
      status: before.status === QuoteStatus.PENDING && input.salesExecutiveId ? QuoteStatus.IN_REVIEW : before.status,
      lastActivityAt: new Date()
    });

    const assigneeLabel = quotation.assignedTo ? `${quotation.assignedTo.name} <${quotation.assignedTo.email}>` : "Unassigned";
    await this.quotationRepository.createConversation({
      quotationRequestId: id,
      adminUserId: actorId,
      senderType: QuoteConversationSenderType.SYSTEM,
      conversationType: QuoteConversationType.ASSIGNMENT,
      message: input.note || `Quotation assigned to ${assigneeLabel}.`,
      isInternal: true,
      metadata: this.toJson({
        previousAssignedToId: before.assignedToId,
        assignedToId: input.salesExecutiveId
      })
    });

    if (quotation.assignedTo) {
      await this.sendAssignmentEmail(quotation);
    }

    await this.audit(actorId, AdminAction.QUOTATION_ASSIGNED, quotation, before, meta);
    return quotation;
  }

  async changeStatus(id: string, input: UpdateQuotationStatusInput, actorId: string, meta: RequestMeta) {
    const before = await this.get(id);
    const now = new Date();
    const statusDates = this.statusDateFields(input.status, now);
    const quotation = await this.quotationRepository.updateStatus(id, input.status, statusDates);

    await this.quotationRepository.createConversation({
      quotationRequestId: id,
      adminUserId: actorId,
      senderType: QuoteConversationSenderType.SYSTEM,
      conversationType: QuoteConversationType.STATUS_CHANGE,
      message: input.note || `Quotation status changed from ${before.status} to ${input.status}.`,
      isInternal: true,
      metadata: this.toJson({
        previousStatus: before.status,
        status: input.status
      })
    });

    if (input.notifyCustomer) {
      await this.sendStatusEmail(quotation, input.note);
    }

    await this.audit(actorId, AdminAction.QUOTATION_STATUS_CHANGED, quotation, before, meta);
    return quotation;
  }

  async addConversation(id: string, input: AddConversationInput, actorId: string, meta: RequestMeta) {
    const quotation = await this.get(id);
    const isInternal = input.isInternal ?? false;
    const conversation = await this.quotationRepository.createConversation({
      quotationRequestId: id,
      adminUserId: actorId,
      senderType: QuoteConversationSenderType.ADMIN,
      conversationType: isInternal ? QuoteConversationType.INTERNAL_NOTE : input.conversationType ?? QuoteConversationType.MESSAGE,
      message: input.message,
      isInternal,
      metadata: input.metadata ? this.toJson(input.metadata) : undefined
    });

    await this.quotationRepository.update(id, { lastActivityAt: new Date() });

    if (!isInternal && input.notifyCustomer) {
      await this.sendConversationEmail(quotation, input.message);
      await this.quotationRepository.createConversation({
        quotationRequestId: id,
        adminUserId: actorId,
        senderType: QuoteConversationSenderType.SYSTEM,
        conversationType: QuoteConversationType.EMAIL,
        message: "Customer notification email sent.",
        isInternal: true
      });
    }

    await this.audit(actorId, AdminAction.QUOTATION_MESSAGE_ADDED, quotation, undefined, meta);
    return conversation;
  }

  async listConversations(id: string) {
    await this.get(id);
    return this.quotationRepository.listConversations(id);
  }

  async softDelete(id: string, actorId: string, meta: RequestMeta) {
    const before = await this.get(id);
    const quotation = await this.quotationRepository.update(id, {
      deletedAt: new Date(),
      lastActivityAt: new Date()
    });

    await this.audit(actorId, AdminAction.DELETE, quotation, before, meta);
    return quotation;
  }

  async exportCsv(query: QuotationListQuery, actorId: string, meta: RequestMeta) {
    const where = this.buildWhere({ ...query, includeDeleted: query.includeDeleted, deletedOnly: query.deletedOnly });
    const rows = await this.quotationRepository.findMany({
      where,
      include: listInclude,
      orderBy: { [query.sortBy]: query.sortOrder },
      take: 10000
    });

    await this.authRepository.createAuditLog({
      actorId,
      action: AdminAction.QUOTATION_EXPORTED,
      entityType: "QuotationRequest",
      afterData: this.toJson({ count: rows.length, filters: query }),
      ...meta
    });

    return {
      filename: `quotations-${new Date().toISOString().slice(0, 10)}.csv`,
      content: this.toCsv(rows)
    };
  }

  async salesExecutives() {
    return this.quotationRepository.findSalesExecutives();
  }

  private async createWithUniqueNumber(input: CreateQuotationInput) {
    let lastError: unknown;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const requestNo = await this.generateRequestNo();

      try {
        return await this.quotationRepository.create({
          requestNo,
          companyName: input.companyName,
          companyWebsite: input.companyWebsite,
          contactPerson: input.contactPerson,
          email: input.email,
          phone: input.phone,
          country: input.country,
          source: input.source,
          expectedDeliveryDate: input.expectedDeliveryDate,
          estimatedBudget: input.estimatedBudget,
          currency: input.currency,
          message: input.message,
          status: QuoteStatus.PENDING,
          items: {
            create: input.items.map((item, index) => ({
              property: item.propertyId ? { connect: { id: item.propertyId } } : undefined,
              category: item.categoryId ? { connect: { id: item.categoryId } } : undefined,
              unit: item.unitId ? { connect: { id: item.unitId } } : undefined,
              itemName: item.itemName,
              description: item.description,
              quantity: item.quantity,
              sortOrder: item.sortOrder ?? index
            }))
          }
        });
      } catch (error) {
        lastError = error;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          continue;
        }
        throw error;
      }
    }

    throw lastError instanceof Error ? lastError : new AppError("Could not generate quotation number", 500);
  }

  private async generateRequestNo() {
    const now = new Date();
    const datePart = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("");
    const prefix = `RFQ-${datePart}`;
    const count = await this.quotationRepository.countByRequestNoPrefix(`${prefix}-`);
    return `${prefix}-${String(count + 1).padStart(4, "0")}`;
  }

  private buildWhere(query: QuotationListQuery): Prisma.QuotationRequestWhereInput {
    const where: Prisma.QuotationRequestWhereInput = {};

    if (query.deletedOnly) {
      where.deletedAt = { not: null };
    } else if (!query.includeDeleted) {
      where.deletedAt = null;
    }

    if (query.status) where.status = query.status;
    if (query.assignedToId) where.assignedToId = query.assignedToId;
    if (query.email) where.email = { contains: query.email, mode: "insensitive" };
    if (query.country) where.country = { contains: query.country, mode: "insensitive" };

    if (query.createdFrom || query.createdTo) {
      where.createdAt = {
        ...(query.createdFrom ? { gte: query.createdFrom } : {}),
        ...(query.createdTo ? { lte: query.createdTo } : {})
      };
    }

    if (query.search) {
      where.OR = [
        { requestNo: { contains: query.search, mode: "insensitive" } },
        { companyName: { contains: query.search, mode: "insensitive" } },
        { contactPerson: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { phone: { contains: query.search, mode: "insensitive" } },
        { message: { contains: query.search, mode: "insensitive" } },
        {
          items: {
            some: {
              itemName: { contains: query.search, mode: "insensitive" }
            }
          }
        }
      ];
    }

    return where;
  }

  private async assertSalesExecutive(adminId: string) {
    const admin = await this.quotationRepository.findAdminWithRoles(adminId);
    const roleSlugs = admin?.roles.map(({ role }) => role.slug) ?? [];

    if (!admin || !roleSlugs.some((role) => ["sales-executive", "manager", "super-admin", "owner"].includes(role))) {
      throw new AppError("Assigned admin must be a Sales Executive or manager", 400);
    }
  }

  private statusDateFields(status: QuoteStatus, now: Date): Prisma.QuotationRequestUpdateInput {
    if (status === QuoteStatus.QUOTED) return { quotedAt: now };
    if (status === QuoteStatus.COMPLETED) return { completedAt: now };
    if (status === QuoteStatus.REJECTED) return { rejectedAt: now };
    return {};
  }

  private sendCustomerConfirmation(quotation: QuotationWithDetails) {
    return sendMail({
      to: quotation.email,
      subject: `RFQ received: ${quotation.requestNo}`,
      text: `Thank you for your quotation request. Your RFQ number is ${quotation.requestNo}.`,
      html: `<p>Hello ${quotation.contactPerson},</p><p>Thank you for your quotation request. Your RFQ number is <strong>${quotation.requestNo}</strong>.</p><p>Our team will review it and contact you soon.</p>`
    });
  }

  private notifyAdmins(quotation: QuotationWithDetails) {
    if (env.adminEmails.length === 0) return Promise.resolve(null);

    const adminUrl = `${env.ADMIN_APP_URL}/quotations/${quotation.id}`;
    return sendMail({
      to: env.adminEmails,
      subject: `New RFQ submitted: ${quotation.requestNo}`,
      text: `A new RFQ was submitted by ${quotation.contactPerson}. View: ${adminUrl}`,
      html: `<p>A new RFQ was submitted.</p><p><strong>${quotation.requestNo}</strong></p><p>${quotation.contactPerson} (${quotation.email})</p><p><a href="${adminUrl}">Open quotation</a></p>`
    });
  }

  private sendAssignmentEmail(quotation: QuotationWithDetails) {
    if (!quotation.assignedTo) return Promise.resolve(null);

    const adminUrl = `${env.ADMIN_APP_URL}/quotations/${quotation.id}`;
    return sendMail({
      to: quotation.assignedTo.email,
      subject: `RFQ assigned: ${quotation.requestNo}`,
      text: `RFQ ${quotation.requestNo} has been assigned to you. View: ${adminUrl}`,
      html: `<p>RFQ <strong>${quotation.requestNo}</strong> has been assigned to you.</p><p><a href="${adminUrl}">Open quotation</a></p>`
    });
  }

  private sendStatusEmail(quotation: QuotationWithDetails, note?: string) {
    return sendMail({
      to: quotation.email,
      subject: `RFQ update: ${quotation.requestNo}`,
      text: `Your RFQ status is now ${quotation.status}.${note ? `\n\n${note}` : ""}`,
      html: `<p>Hello ${quotation.contactPerson},</p><p>Your RFQ <strong>${quotation.requestNo}</strong> status is now <strong>${quotation.status}</strong>.</p>${note ? `<p>${note}</p>` : ""}`
    });
  }

  private sendConversationEmail(quotation: QuotationWithDetails, message: string) {
    return sendMail({
      to: quotation.email,
      subject: `Message about RFQ ${quotation.requestNo}`,
      text: message,
      html: `<p>Hello ${quotation.contactPerson},</p><p>${message}</p>`
    });
  }

  private toCsv(rows: unknown[]) {
    const header = [
      "Request No",
      "Status",
      "Company",
      "Contact Person",
      "Email",
      "Phone",
      "Country",
      "Assigned To",
      "Items",
      "Estimated Budget",
      "Currency",
      "Last Activity",
      "Created At"
    ];

    const lines = rows.map((row) => {
      const quotation = row as QuotationWithDetails;
      const items = quotation.items.map((item) => `${item.itemName} (${item.quantity})`).join("; ");
      return [
        quotation.requestNo,
        quotation.status,
        quotation.companyName ?? "",
        quotation.contactPerson,
        quotation.email,
        quotation.phone ?? "",
        quotation.country ?? "",
        quotation.assignedTo?.email ?? "",
        items,
        quotation.estimatedBudget?.toString() ?? "",
        quotation.currency ?? "",
        quotation.lastActivityAt.toISOString(),
        quotation.createdAt.toISOString()
      ]
        .map((value) => this.csvCell(value))
        .join(",");
    });

    return [header.map((value) => this.csvCell(value)).join(","), ...lines].join("\n");
  }

  private csvCell(value: string) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  private audit(
    actorId: string | null,
    action: AdminAction,
    afterData: QuotationWithDetails,
    beforeData: QuotationWithDetails | undefined,
    meta: RequestMeta
  ) {
    return this.authRepository.createAuditLog({
      actorId,
      action,
      entityType: "QuotationRequest",
      entityId: afterData.id,
      beforeData: beforeData ? this.toJson(beforeData) : undefined,
      afterData: this.toJson(afterData),
      ...meta
    });
  }

  private toJson(value: unknown) {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }
}
