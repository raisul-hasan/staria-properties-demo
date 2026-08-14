import { PropertyPurpose, PropertyStatus } from "@prisma/client";
import { z } from "zod";
import { booleanFromString } from "./common.validator";

export const propertyListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    q: z.string().trim().optional(),
    purpose: z.nativeEnum(PropertyPurpose).optional(),
    type: z.string().trim().optional(),
    location: z.string().trim().optional(),
    status: z.nativeEnum(PropertyStatus).optional(),
    category: z.string().trim().optional(),
    featured: booleanFromString,
    published: booleanFromString,
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional()
  })
});

export const propertyBodySchema = z.object({
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(220).optional(),
  location: z.string().trim().min(2).max(180),
  priceLabel: z.string().trim().min(1).max(80),
  priceValue: z.coerce.number().nonnegative().optional(),
  purpose: z.nativeEnum(PropertyPurpose).default(PropertyPurpose.BUY),
  type: z.string().trim().min(2).max(100),
  status: z.nativeEnum(PropertyStatus).default(PropertyStatus.FOR_SALE),
  beds: z.coerce.number().int().nonnegative().nullable().optional(),
  baths: z.coerce.number().int().nonnegative().nullable().optional(),
  areaSqft: z.coerce.number().int().positive().optional(),
  areaLabel: z.string().trim().max(60).optional(),
  description: z.string().trim().max(5000).optional(),
  features: z.array(z.string().trim().min(1)).default([]),
  imageUrl: z.string().url(),
  gallery: z.array(z.string().url()).default([]),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  metaTitle: z.string().trim().max(180).optional(),
  metaDescription: z.string().trim().max(300).optional(),
  categoryId: z.string().uuid().nullable().optional()
});

export const createPropertySchema = z.object({ body: propertyBodySchema });

export const updatePropertySchema = z.object({
  body: propertyBodySchema.partial()
});

export const propertyCategoryBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().max(1000).optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true)
});

export const createPropertyCategorySchema = z.object({ body: propertyCategoryBodySchema });

export const updatePropertyCategorySchema = z.object({
  body: propertyCategoryBodySchema.partial()
});
