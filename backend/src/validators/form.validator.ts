import { InquiryStatus, NewsletterStatus } from "@prisma/client";
import { z } from "zod";
import { emailSchema, uuidSchema } from "./shared";

export const contactSubmissionSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(140),
    email: emailSchema,
    phone: z.string().trim().max(40).optional().nullable(),
    subject: z.string().trim().max(180).optional().nullable(),
    message: z.string().trim().min(5).max(5000),
    source: z.string().trim().max(120).default("website").optional(),
    consentAccepted: z.literal(true, {
      errorMap: () => ({ message: "You must accept the privacy notice before submitting" })
    }),
    recaptchaToken: z.string().trim().optional().nullable(),
    honeypot: z.string().trim().optional().nullable()
  })
});

export const newsletterSubscriptionSchema = z.object({
  body: z.object({
    email: emailSchema,
    fullName: z.string().trim().max(140).optional().nullable(),
    source: z.string().trim().max(120).default("website").optional(),
    consentAccepted: z.literal(true, {
      errorMap: () => ({ message: "You must accept the privacy notice before subscribing" })
    }),
    recaptchaToken: z.string().trim().optional().nullable(),
    honeypot: z.string().trim().optional().nullable()
  })
});

export const contactListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    status: z.nativeEnum(InquiryStatus).optional(),
    assignedToId: uuidSchema.optional(),
    email: z.string().trim().optional(),
    source: z.string().trim().optional(),
    isSpam: z.coerce.boolean().optional(),
    createdFrom: z.coerce.date().optional(),
    createdTo: z.coerce.date().optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "fullName", "email", "status", "spamScore"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    includeDeleted: z.coerce.boolean().default(false),
    deletedOnly: z.coerce.boolean().default(false)
  })
});

export const newsletterListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    status: z.nativeEnum(NewsletterStatus).optional(),
    email: z.string().trim().optional(),
    source: z.string().trim().optional(),
    isSpam: z.coerce.boolean().optional(),
    createdFrom: z.coerce.date().optional(),
    createdTo: z.coerce.date().optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "subscribedAt", "email", "status", "spamScore"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    includeDeleted: z.coerce.boolean().default(false),
    deletedOnly: z.coerce.boolean().default(false)
  })
});

export const idParamSchema = z.object({
  params: z.object({
    id: uuidSchema
  })
});

export const updateContactStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(InquiryStatus),
    assignedToId: uuidSchema.optional().nullable(),
    internalNotes: z.string().trim().max(5000).optional().nullable()
  })
});

export const updateNewsletterStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(NewsletterStatus),
    fullName: z.string().trim().max(140).optional().nullable(),
    source: z.string().trim().max(120).optional().nullable()
  })
});
