import { ProjectStatus } from "@prisma/client";
import { z } from "zod";
import { booleanFromString } from "./common.validator";

export const projectListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    q: z.string().trim().optional(),
    category: z.string().trim().optional(),
    status: z.nativeEnum(ProjectStatus).optional(),
    featured: booleanFromString,
    published: booleanFromString
  })
});

export const projectBodySchema = z.object({
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(220).optional(),
  location: z.string().trim().min(2).max(180),
  type: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(80),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.UPCOMING),
  statusLabel: z.string().trim().min(2).max(80),
  statusColor: z.string().trim().max(40).optional(),
  description: z.string().trim().max(7000).optional(),
  areaLabel: z.string().trim().max(80).optional(),
  unitsLabel: z.string().trim().max(120).optional(),
  features: z.array(z.string().trim().min(1)).default([]),
  imageUrl: z.string().url(),
  gallery: z.array(z.string().url()).default([]),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  metaTitle: z.string().trim().max(180).optional(),
  metaDescription: z.string().trim().max(300).optional()
});

export const createProjectSchema = z.object({ body: projectBodySchema });
export const updateProjectSchema = z.object({ body: projectBodySchema.partial() });
