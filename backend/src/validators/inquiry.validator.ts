import { InquiryStatus } from "@prisma/client";
import { z } from "zod";

export const inquirySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().max(40).optional(),
    subject: z.string().trim().max(180).optional(),
    serviceInterest: z.string().trim().max(120).optional(),
    source: z.string().trim().max(120).optional(),
    message: z.string().trim().min(10).max(4000),
    metadata: z.record(z.unknown()).optional()
  })
});

export const inquiryListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    status: z.nativeEnum(InquiryStatus).optional(),
    q: z.string().trim().optional()
  })
});

export const updateInquiryStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(InquiryStatus)
  })
});
