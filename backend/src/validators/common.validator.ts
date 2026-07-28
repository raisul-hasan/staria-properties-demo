import { z } from "zod";
import { uuidSchema } from "./shared";

export const idParamSchema = z.object({
  params: z.object({
    id: uuidSchema
  })
});

export const slugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required")
  })
});

export const listQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    q: z.string().trim().optional(),
    featured: z
      .string()
      .optional()
      .transform((value) => (value === undefined ? undefined : value === "true")),
    published: z
      .string()
      .optional()
      .transform((value) => (value === undefined ? undefined : value === "true"))
  })
});

export const booleanFromString = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (typeof value === "boolean") return value;
    return value === "true";
  });
