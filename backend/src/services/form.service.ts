import { AdminAction, InquiryStatus, NewsletterStatus, Prisma } from "@prisma/client";
import { env } from "../config/env";
import { sendMail } from "../config/mail";
import { AuthRepository } from "../repositories/auth.repository";
import { ContactMessageWithAssignee, FormRepository } from "../repositories/form.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";
import { assessSubmission } from "../utils/spamProtection";
import { RequestMeta } from "./auth.service";

type ContactSubmissionInput = {
  fullName: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  source?: string | null;
  consentAccepted?: boolean;
  recaptchaToken?: string | null;
  honeypot?: string | null;
};

type NewsletterSubmissionInput = {
  email: string;
  fullName?: string | null;
  source?: string | null;
  consentAccepted?: boolean;
  recaptchaToken?: string | null;
  honeypot?: string | null;
};

type ContactListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: InquiryStatus;
  assignedToId?: string;
  email?: string;
  source?: string;
  isSpam?: boolean;
  createdFrom?: Date;
  createdTo?: Date;
  sortBy: "createdAt" | "updatedAt" | "fullName" | "email" | "status" | "spamScore";
  sortOrder: "asc" | "desc";
  includeDeleted: boolean;
  deletedOnly: boolean;
};

type NewsletterListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: NewsletterStatus;
  email?: string;
  source?: string;
  isSpam?: boolean;
  createdFrom?: Date;
  createdTo?: Date;
  sortBy: "createdAt" | "updatedAt" | "subscribedAt" | "email" | "status" | "spamScore";
  sortOrder: "asc" | "desc";
  includeDeleted: boolean;
  deletedOnly: boolean;
};

type UpdateContactInput = {
  status: InquiryStatus;
  assignedToId?: string | null;
  internalNotes?: string | null;
};

type UpdateNewsletterInput = {
  status: NewsletterStatus;
  fullName?: string | null;
  source?: string | null;
};

export class FormService {
  constructor(
    private readonly formRepository = new FormRepository(),
    private readonly authRepository = new AuthRepository()
  ) {}

  async submitContact(input: ContactSubmissionInput, meta: RequestMeta) {
    const assessment = await assessSubmission({
      email: input.email,
      name: input.fullName ?? undefined,
      subject: input.subject,
      message: input.message,
      honeypot: input.honeypot,
      recaptchaToken: input.recaptchaToken,
      expectedAction: "contact",
      ipAddress: meta.ipAddress
    });

    const contact = await this.formRepository.createContact({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      source: input.source ?? "website",
      consentAccepted: input.consentAccepted ?? false,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      recaptchaScore: assessment.recaptchaScore,
      recaptchaAction: assessment.recaptchaAction,
      spamScore: assessment.spamScore,
      spamReason: assessment.spamReason,
      status: assessment.isSpam ? InquiryStatus.SPAM : InquiryStatus.NEW
    });

    await this.audit(null, AdminAction.CONTACT_SUBMITTED, "ContactMessage", contact.id, undefined, contact, meta);

    if (!assessment.isSpam) {
      await Promise.all([this.sendContactConfirmation(contact), this.notifyAdminsContact(contact)]);
    }

    return {
      id: contact.id,
      status: contact.status,
      createdAt: contact.createdAt
    };
  }

  async subscribeNewsletter(input: NewsletterSubmissionInput, meta: RequestMeta) {
    const assessment = await assessSubmission({
      email: input.email,
      name: input.fullName ?? undefined,
      honeypot: input.honeypot ?? undefined,
      recaptchaToken: input.recaptchaToken ?? undefined,
      expectedAction: "newsletter",
      ipAddress: meta.ipAddress
    });

    const subscriber = await this.formRepository.upsertNewsletter(input.email, {
      email: input.email,
      fullName: input.fullName,
      source: input.source ?? "website",
      consentAccepted: input.consentAccepted ?? false,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      recaptchaScore: assessment.recaptchaScore,
      recaptchaAction: assessment.recaptchaAction,
      spamScore: assessment.spamScore,
      spamReason: assessment.spamReason,
      status: assessment.isSpam ? NewsletterStatus.SPAM : NewsletterStatus.SUBSCRIBED,
      subscribedAt: new Date()
    });

    await this.audit(
      null,
      AdminAction.NEWSLETTER_SUBSCRIBED,
      "NewsletterSubscriber",
      subscriber.id,
      undefined,
      subscriber,
      meta
    );

    if (!assessment.isSpam) {
      await Promise.all([this.sendNewsletterConfirmation(subscriber), this.notifyAdminsNewsletter(subscriber)]);
    }

    return {
      id: subscriber.id,
      status: subscriber.status,
      subscribedAt: subscriber.subscribedAt
    };
  }

  async listContacts(query: ContactListQuery) {
    const where = this.contactWhere(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      this.formRepository.findContacts({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit
      }),
      this.formRepository.countContacts(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async contactStats() {
    const counts = await this.formRepository.contactStatusCounts();
    return Object.values(InquiryStatus).reduce<Record<string, number>>((acc, status) => {
      acc[status] = counts.find((item) => item.status === status)?._count.status ?? 0;
      return acc;
    }, {});
  }

  async getContact(id: string) {
    const contact = await this.formRepository.findContactById(id);
    if (!contact || contact.deletedAt) {
      throw new AppError("Contact submission was not found", 404);
    }
    return contact;
  }

  async updateContact(id: string, input: UpdateContactInput, actorId: string, meta: RequestMeta) {
    const before = await this.getContact(id);

    if (input.assignedToId) {
      const admin = await this.formRepository.findActiveAdmin(input.assignedToId);
      if (!admin) {
        throw new AppError("Assigned admin was not found", 400);
      }
    }

    const contact = await this.formRepository.updateContact(id, {
      status: input.status,
      internalNotes: input.internalNotes,
      assignedTo:
        input.assignedToId === undefined
          ? undefined
          : input.assignedToId
            ? { connect: { id: input.assignedToId } }
            : { disconnect: true }
    });

    await this.audit(actorId, AdminAction.CONTACT_STATUS_CHANGED, "ContactMessage", contact.id, before, contact, meta);
    return contact;
  }

  async deleteContact(id: string, actorId: string, meta: RequestMeta) {
    const before = await this.getContact(id);
    const contact = await this.formRepository.updateContact(id, {
      deletedAt: new Date()
    });

    await this.audit(actorId, AdminAction.DELETE, "ContactMessage", contact.id, before, contact, meta);
    return contact;
  }

  async listNewsletter(query: NewsletterListQuery) {
    const where = this.newsletterWhere(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      this.formRepository.findNewsletter({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit
      }),
      this.formRepository.countNewsletter(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async newsletterStats() {
    const counts = await this.formRepository.newsletterStatusCounts();
    return Object.values(NewsletterStatus).reduce<Record<string, number>>((acc, status) => {
      acc[status] = counts.find((item) => item.status === status)?._count.status ?? 0;
      return acc;
    }, {});
  }

  async getNewsletter(id: string) {
    const subscriber = await this.formRepository.findNewsletterById(id);
    if (!subscriber || subscriber.deletedAt) {
      throw new AppError("Newsletter subscriber was not found", 404);
    }
    return subscriber;
  }

  async updateNewsletter(id: string, input: UpdateNewsletterInput, actorId: string, meta: RequestMeta) {
    const before = await this.getNewsletter(id);
    const subscriber = await this.formRepository.updateNewsletter(id, {
      status: input.status,
      fullName: input.fullName,
      source: input.source,
      unsubscribedAt: input.status === NewsletterStatus.UNSUBSCRIBED ? new Date() : null,
      subscribedAt: input.status === NewsletterStatus.SUBSCRIBED ? new Date() : before.subscribedAt
    });

    await this.audit(
      actorId,
      AdminAction.NEWSLETTER_STATUS_CHANGED,
      "NewsletterSubscriber",
      subscriber.id,
      before,
      subscriber,
      meta
    );
    return subscriber;
  }

  async deleteNewsletter(id: string, actorId: string, meta: RequestMeta) {
    const before = await this.getNewsletter(id);
    const subscriber = await this.formRepository.updateNewsletter(id, {
      deletedAt: new Date(),
      status: NewsletterStatus.UNSUBSCRIBED,
      unsubscribedAt: new Date()
    });

    await this.audit(actorId, AdminAction.DELETE, "NewsletterSubscriber", subscriber.id, before, subscriber, meta);
    return subscriber;
  }

  private contactWhere(query: ContactListQuery): Prisma.ContactMessageWhereInput {
    const where: Prisma.ContactMessageWhereInput = {};

    this.applyDeletedFilter(where, query);
    if (query.status) where.status = query.status;
    if (query.assignedToId) where.assignedToId = query.assignedToId;
    if (query.email) where.email = { contains: query.email, mode: "insensitive" };
    if (query.source) where.source = { contains: query.source, mode: "insensitive" };
    if (query.isSpam !== undefined) where.spamScore = query.isSpam ? { gte: 60 } : { lt: 60 };
    if (query.createdFrom || query.createdTo) {
      where.createdAt = {
        ...(query.createdFrom ? { gte: query.createdFrom } : {}),
        ...(query.createdTo ? { lte: query.createdTo } : {})
      };
    }

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { phone: { contains: query.search, mode: "insensitive" } },
        { subject: { contains: query.search, mode: "insensitive" } },
        { message: { contains: query.search, mode: "insensitive" } },
        { spamReason: { contains: query.search, mode: "insensitive" } }
      ];
    }

    return where;
  }

  private newsletterWhere(query: NewsletterListQuery): Prisma.NewsletterSubscriberWhereInput {
    const where: Prisma.NewsletterSubscriberWhereInput = {};

    this.applyDeletedFilter(where, query);
    if (query.status) where.status = query.status;
    if (query.email) where.email = { contains: query.email, mode: "insensitive" };
    if (query.source) where.source = { contains: query.source, mode: "insensitive" };
    if (query.isSpam !== undefined) where.spamScore = query.isSpam ? { gte: 60 } : { lt: 60 };
    if (query.createdFrom || query.createdTo) {
      where.createdAt = {
        ...(query.createdFrom ? { gte: query.createdFrom } : {}),
        ...(query.createdTo ? { lte: query.createdTo } : {})
      };
    }

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { source: { contains: query.search, mode: "insensitive" } },
        { spamReason: { contains: query.search, mode: "insensitive" } }
      ];
    }

    return where;
  }

  private applyDeletedFilter(
    where: { deletedAt?: unknown },
    query: { includeDeleted: boolean; deletedOnly: boolean }
  ) {
    if (query.deletedOnly) {
      where.deletedAt = { not: null };
    } else if (!query.includeDeleted) {
      where.deletedAt = null;
    }
  }

  private sendContactConfirmation(contact: ContactMessageWithAssignee) {
    return sendMail({
      to: contact.email,
      subject: "We received your message",
      text: `Hello ${contact.fullName}, our team received your message and will contact you shortly.`,
      html: `<p>Hello ${this.escape(contact.fullName)},</p><p>Thank you for contacting Staria Properties. Our team received your message and will contact you shortly.</p>`
    });
  }

  private notifyAdminsContact(contact: ContactMessageWithAssignee) {
    if (env.adminEmails.length === 0) return Promise.resolve(null);

    const adminUrl = `${env.ADMIN_APP_URL}/contact-submissions/${contact.id}`;
    return sendMail({
      to: env.adminEmails,
      subject: `New contact submission: ${contact.subject ?? contact.fullName}`,
      text: `New contact submission from ${contact.fullName} (${contact.email}). View: ${adminUrl}`,
      html: `<p>New contact submission received.</p><p><strong>${this.escape(contact.fullName)}</strong> (${this.escape(contact.email)})</p><p><a href="${adminUrl}">Open submission</a></p>`
    });
  }

  private sendNewsletterConfirmation(subscriber: { email: string; fullName: string | null }) {
    return sendMail({
      to: subscriber.email,
      subject: "Newsletter subscription confirmed",
      text: "You are subscribed to Staria Properties updates.",
      html: `<p>Hello ${this.escape(subscriber.fullName ?? "there")},</p><p>You are subscribed to Staria Properties updates.</p>`
    });
  }

  private notifyAdminsNewsletter(subscriber: { id: string; email: string; fullName: string | null }) {
    if (env.adminEmails.length === 0) return Promise.resolve(null);

    const adminUrl = `${env.ADMIN_APP_URL}/newsletter-subscribers/${subscriber.id}`;
    return sendMail({
      to: env.adminEmails,
      subject: "New newsletter subscription",
      text: `New newsletter subscription: ${subscriber.email}. View: ${adminUrl}`,
      html: `<p>New newsletter subscription.</p><p>${this.escape(subscriber.fullName ?? subscriber.email)}</p><p><a href="${adminUrl}">Open subscriber</a></p>`
    });
  }

  private audit(
    actorId: string | null,
    action: AdminAction,
    entityType: string,
    entityId: string,
    beforeData: unknown,
    afterData: unknown,
    meta: RequestMeta
  ) {
    return this.authRepository.createAuditLog({
      actorId,
      action,
      entityType,
      entityId,
      beforeData: beforeData ? this.toJson(beforeData) : undefined,
      afterData: this.toJson(afterData),
      ...meta
    });
  }

  private toJson(value: unknown) {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }

  private escape(value: string) {
    return value.replace(/[&<>"']/g, (char) => {
      const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return map[char];
    });
  }
}
