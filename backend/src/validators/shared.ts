import { z } from "zod";

export const uuidSchema = z.string().uuid("Invalid id");

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .max(160)
  .transform((value) => value.toLowerCase());

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export const sortOrderSchema = z.enum(["asc", "desc"]).default("desc");

export const softDeleteQuerySchema = z.object({
  includeDeleted: z.coerce.boolean().default(false),
  deletedOnly: z.coerce.boolean().default(false)
});
