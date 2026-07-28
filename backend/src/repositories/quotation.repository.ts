import { Prisma, QuoteConversationSenderType, QuoteConversationType, QuoteStatus } from "@prisma/client";
import { prisma } from "../config/prisma";

const quotationInclude = {
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
  conversations: {
    include: {
      adminUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "asc" }
  }
} satisfies Prisma.QuotationRequestInclude;

export type QuotationWithDetails = Prisma.QuotationRequestGetPayload<{ include: typeof quotationInclude }>;

export class QuotationRepository {
  countByRequestNoPrefix(prefix: string) {
    return prisma.quotationRequest.count({
      where: {
        requestNo: {
          startsWith: prefix
        }
      }
    });
  }

  create(data: Prisma.QuotationRequestCreateInput) {
    return prisma.quotationRequest.create({
      data,
      include: quotationInclude
    });
  }

  count(where: Prisma.QuotationRequestWhereInput) {
    return prisma.quotationRequest.count({ where });
  }

  findMany(args: Prisma.QuotationRequestFindManyArgs) {
    return prisma.quotationRequest.findMany(args);
  }

  findById(id: string) {
    return prisma.quotationRequest.findFirst({
      where: { id },
      include: quotationInclude
    });
  }

  update(id: string, data: Prisma.QuotationRequestUpdateInput) {
    return prisma.quotationRequest.update({
      where: { id },
      data,
      include: quotationInclude
    });
  }

  createConversation(data: {
    quotationRequestId: string;
    adminUserId?: string | null;
    senderType: QuoteConversationSenderType;
    conversationType: QuoteConversationType;
    message: string;
    isInternal?: boolean;
    metadata?: Prisma.InputJsonValue;
  }) {
    return prisma.quotationConversation.create({
      data: {
        quotationRequest: { connect: { id: data.quotationRequestId } },
        adminUser: data.adminUserId ? { connect: { id: data.adminUserId } } : undefined,
        senderType: data.senderType,
        conversationType: data.conversationType,
        message: data.message,
        isInternal: data.isInternal ?? false,
        metadata: data.metadata
      },
      include: {
        adminUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  listConversations(quotationRequestId: string) {
    return prisma.quotationConversation.findMany({
      where: { quotationRequestId },
      include: {
        adminUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });
  }

  findAdminWithRoles(id: string) {
    return prisma.adminUser.findFirst({
      where: {
        id,
        deletedAt: null,
        status: "ACTIVE"
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  findSalesExecutives() {
    return prisma.adminUser.findMany({
      where: {
        deletedAt: null,
        status: "ACTIVE",
        roles: {
          some: {
            role: {
              slug: "sales-executive",
              deletedAt: null
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: { name: "asc" }
    });
  }

  statusCounts() {
    return prisma.quotationRequest.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { status: true }
    });
  }

  updateStatus(id: string, status: QuoteStatus, data: Prisma.QuotationRequestUpdateInput = {}) {
    return this.update(id, {
      ...data,
      status,
      lastActivityAt: new Date()
    });
  }
}
