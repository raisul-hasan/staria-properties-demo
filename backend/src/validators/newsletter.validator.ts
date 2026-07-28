import { z } from "zod";

export const subscribeSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(160),
    name: z.string().trim().max(120).optional(),
    source: z.string().trim().max(120).optional()
  })
});

export const newsletterListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    active: z
      .string()
      .optional()
      .transform((value) => (value === undefined ? undefined : value === "true")),
    q: z.string().trim().optional()
  })
});
