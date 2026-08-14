import { z } from "zod";
import { booleanFromString } from "./common.validator";

export const newsListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    q: z.string().trim().optional(),
    category: z.string().trim().optional(),
    featured: booleanFromString,
    published: booleanFromString
  })
});

export const newsBodySchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(260).optional(),
  category: z.string().trim().min(2).max(100),
  excerpt: z.string().trim().min(2).max(800),
  content: z.string().trim().min(2),
  imageUrl: z.string().url(),
  readTime: z.string().trim().max(40).optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  metaTitle: z.string().trim().max(180).optional(),
  metaDescription: z.string().trim().max(300).optional()
});

export const createNewsSchema = z.object({ body: newsBodySchema });
export const updateNewsSchema = z.object({ body: newsBodySchema.partial() });

export const faqListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    category: z.string().trim().optional(),
    published: booleanFromString
  })
});

export const faqBodySchema = z.object({
  question: z.string().trim().min(2).max(300),
  answer: z.string().trim().min(2).max(3000),
  category: z.string().trim().max(100).optional(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true)
});

export const createFaqSchema = z.object({ body: faqBodySchema });
export const updateFaqSchema = z.object({ body: faqBodySchema.partial() });

export const testimonialListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    featured: booleanFromString,
    published: booleanFromString
  })
});

export const testimonialBodySchema = z.object({
  quote: z.string().trim().min(2).max(2000),
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().max(120).optional(),
  company: z.string().trim().max(160).optional(),
  photoUrl: z.string().url().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0)
});

export const createTestimonialSchema = z.object({ body: testimonialBodySchema });
export const updateTestimonialSchema = z.object({ body: testimonialBodySchema.partial() });

export const interiorPortfolioListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    category: z.string().trim().optional(),
    featured: booleanFromString,
    published: booleanFromString
  })
});

export const interiorPortfolioBodySchema = z.object({
  title: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(220).optional(),
  category: z.string().trim().min(2).max(100),
  imageUrl: z.string().url(),
  description: z.string().trim().max(2000).optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0)
});

export const createInteriorPortfolioSchema = z.object({ body: interiorPortfolioBodySchema });
export const updateInteriorPortfolioSchema = z.object({ body: interiorPortfolioBodySchema.partial() });
