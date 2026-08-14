import { ServiceDivision } from "@prisma/client";
import { z } from "zod";
import { booleanFromString } from "./common.validator";

export const serviceListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    q: z.string().trim().optional(),
    division: z.nativeEnum(ServiceDivision).optional(),
    category: z.string().trim().optional(),
    featured: booleanFromString,
    published: booleanFromString
  })
});

export const serviceBodySchema = z.object({
  title: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(220).optional(),
  division: z.nativeEnum(ServiceDivision),
  category: z.string().trim().min(2).max(120),
  subtitle: z.string().trim().max(180).optional(),
  summary: z.string().trim().min(2).max(800),
  description: z.string().trim().max(7000).optional(),
  features: z.array(z.string().trim().min(1)).default([]),
  icon: z.string().trim().max(80).optional(),
  imageUrl: z.string().url().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  metaTitle: z.string().trim().max(180).optional(),
  metaDescription: z.string().trim().max(300).optional()
});

export const createServiceSchema = z.object({ body: serviceBodySchema });
export const updateServiceSchema = z.object({ body: serviceBodySchema.partial() });
