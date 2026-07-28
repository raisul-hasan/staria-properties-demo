import { QuoteConversationType, QuoteStatus } from "@prisma/client";
import { z } from "zod";
import { emailSchema, uuidSchema } from "./shared";

const quotationItemSchema = z.object({
  propertyId: uuidSchema.optional().nullable(),
  categoryId: uuidSchema.optional().nullable(),
  unitId: uuidSchema.optional().nullable(),
  itemName: z.string().trim().min(1).max(180),
  description: z.string().trim().optional().nullable(),
  quantity: z.coerce.number().positive(),
  sortOrder: z.coerce.number().int().default(0).optional()
});

export const createQuotationSchema = z.object({
  body: z.object({
    companyName: z.string().trim().max(180).optional().nullable(),
    companyWebsite: z.string().trim().url().optional().nullable(),
    contactPerson: z.string().trim().min(2).max(140),
    email: emailSchema,
    phone: z.string().trim().max(40).optional().nullable(),
    country: z.string().trim().max(100).optional().nullable(),
    source: z.string().trim().max(120).optional().nullable(),
    expectedDeliveryDate: z.coerce.date().optional().nullable(),
    estimatedBudget: z.coerce.number().positive().optional().nullable(),
    currency: z.string().trim().max(10).optional().nullable(),
    message: z.string().trim().max(5000).optional().nullable(),
    items: z.array(quotationItemSchema).min(1, "At least one quotation item is required")
  })
});

export const quotationListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    status: z.nativeEnum(QuoteStatus).optional(),
    assignedToId: uuidSchema.optional(),
    email: z.string().trim().optional(),
    country: z.string().trim().optional(),
    createdFrom: z.coerce.date().optional(),
    createdTo: z.coerce.date().optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "lastActivityAt", "requestNo", "status", "companyName"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    includeDeleted: z.coerce.boolean().default(false),
    deletedOnly: z.coerce.boolean().default(false)
  })
});

export const quotationIdParamSchema = z.object({
  params: z.object({
    id: uuidSchema
  })
});

export const assignQuotationSchema = z.object({
  body: z.object({
    salesExecutiveId: uuidSchema.nullable(),
    note: z.string().trim().max(2000).optional()
  })
});

export const updateQuotationStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(QuoteStatus),
    note: z.string().trim().max(3000).optional(),
    notifyCustomer: z.boolean().default(false)
  })
});

export const updateQuotationSchema = z.object({
  body: z.object({
    internalNotes: z.string().trim().max(5000).optional().nullable(),
    expectedDeliveryDate: z.coerce.date().optional().nullable(),
    estimatedBudget: z.coerce.number().positive().optional().nullable(),
    currency: z.string().trim().max(10).optional().nullable()
  })
});

export const addQuotationConversationSchema = z.object({
  body: z.object({
    message: z.string().trim().min(1).max(5000),
    conversationType: z.nativeEnum(QuoteConversationType).default(QuoteConversationType.MESSAGE).optional(),
    isInternal: z.boolean().default(false),
    notifyCustomer: z.boolean().default(false),
    metadata: z.record(z.unknown()).optional()
  })
});
