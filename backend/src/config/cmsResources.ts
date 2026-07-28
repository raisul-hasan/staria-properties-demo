import {
  ApplicationStatus,
  CareerStatus,
  CategoryType,
  ContentStatus,
  EmploymentType,
  FurnishingStatus,
  MediaUsageRole,
  PageType,
  ProjectDevelopmentStatus,
  PropertyAvailability,
  PropertyListingType,
  RecordStatus
} from "@prisma/client";
import { z } from "zod";

export type CmsAction = "read" | "create" | "update" | "delete";
export type CmsStatusKind = "content" | "record" | "career" | "application";

export type CmsResourceConfig = {
  label: string;
  model: string;
  permissionResource: string;
  statusKind: CmsStatusKind;
  searchFields: string[];
  sortableFields: string[];
  defaultSortBy: string;
  defaultSortOrder: "asc" | "desc";
  softDelete: boolean;
  include?: Record<string, unknown>;
  forcedWhere?: Record<string, unknown>;
  forcedData?: Record<string, unknown>;
  filterFields?: string[];
  slugSource?: string;
  createSchema: z.ZodType<Record<string, unknown>>;
  updateSchema: z.ZodType<Record<string, unknown>>;
};

const uuidSchema = z.string().uuid();
const optionalUuidSchema = uuidSchema.optional().nullable();
const statusSchema = z.string().trim().min(1).optional();
const sortOrderSchema = z.coerce.number().int().default(0).optional();
const nullableDateSchema = z.coerce.date().optional().nullable();
const jsonSchema = z.unknown().optional();

export const cmsListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    status: z.string().trim().optional(),
    sortBy: z.string().trim().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    includeDeleted: z.coerce.boolean().default(false),
    deletedOnly: z.coerce.boolean().default(false),
    categoryType: z.nativeEnum(CategoryType).optional(),
    categoryId: uuidSchema.optional(),
    projectId: uuidSchema.optional(),
    parentId: uuidSchema.optional(),
    pageId: uuidSchema.optional(),
    albumId: uuidSchema.optional(),
    clientId: uuidSchema.optional(),
    clientContactId: uuidSchema.optional(),
    departmentId: uuidSchema.optional(),
    jobPostingId: uuidSchema.optional(),
    group: z.string().trim().optional(),
    pageType: z.nativeEnum(PageType).optional(),
    isFeatured: z.coerce.boolean().optional(),
    isDemo: z.coerce.boolean().optional(),
    listingType: z.nativeEnum(PropertyListingType).optional(),
    availability: z.nativeEnum(PropertyAvailability).optional(),
    developmentStatus: z.nativeEnum(ProjectDevelopmentStatus).optional(),
    bedrooms: z.coerce.number().int().nonnegative().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    createdFrom: z.coerce.date().optional(),
    createdTo: z.coerce.date().optional()
  })
  .passthrough();

export const cmsResourceParamSchema = z.object({
  params: z.object({
    resource: z.string().trim().min(1)
  })
});

export const cmsIdParamSchema = z.object({
  params: z.object({
    resource: z.string().trim().min(1),
    id: uuidSchema
  })
});

export const cmsBodySchema = z.object({
  body: z.record(z.unknown())
});

const seoInputSchema = z.object({
  title: z.string().trim().min(1).max(180).optional(),
  description: z.string().trim().max(320).optional().nullable(),
  keywords: z.string().trim().optional().nullable(),
  canonicalUrl: z.string().trim().optional().nullable(),
  robots: z.string().trim().max(80).optional().nullable(),
  ogTitle: z.string().trim().max(180).optional().nullable(),
  ogDescription: z.string().trim().max(320).optional().nullable(),
  ogImageId: optionalUuidSchema,
  structuredData: jsonSchema,
  status: statusSchema
});

const mediaLinkSchema = z.object({
  mediaId: uuidSchema,
  role: z.nativeEnum(MediaUsageRole).optional(),
  sortOrder: sortOrderSchema
});

const addressSchema = z.object({
  line1: z.string().trim().min(1).max(180),
  line2: z.string().trim().max(180).optional().nullable(),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().max(100).optional().nullable(),
  postalCode: z.string().trim().max(40).optional().nullable(),
  country: z.string().trim().min(1).max(100),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable()
});

const factoryCapabilitySchema = z.object({
  name: z.string().trim().min(1).max(140),
  value: z.string().trim().min(1).max(180),
  unit: z.string().trim().max(40).optional().nullable(),
  sortOrder: sortOrderSchema
});

const clientContactSchema = z.object({
  name: z.string().trim().min(1).max(140),
  designation: z.string().trim().max(140).optional().nullable(),
  email: z.string().trim().email().max(160).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable()
});

const galleryItemSchema = z.object({
  mediaId: uuidSchema,
  title: z.string().trim().max(180).optional().nullable(),
  caption: z.string().trim().optional().nullable(),
  status: statusSchema,
  sortOrder: sortOrderSchema
});

const heroSlideCreateSchema = z.object({
  pageId: optionalUuidSchema,
  mediaId: uuidSchema,
  eyebrow: z.string().trim().max(120).optional().nullable(),
  title: z.string().trim().min(1).max(180),
  subtitle: z.string().trim().max(320).optional().nullable(),
  ctaLabel: z.string().trim().max(80).optional().nullable(),
  ctaUrl: z.string().trim().optional().nullable(),
  status: statusSchema,
  sortOrder: sortOrderSchema,
  publishedAt: nullableDateSchema
});

const categoryCreateSchema = z.object({
  parentId: optionalUuidSchema,
  categoryType: z.nativeEnum(CategoryType),
  name: z.string().trim().min(1).max(140),
  slug: z.string().trim().max(160).optional(),
  description: z.string().trim().optional().nullable(),
  status: statusSchema,
  sortOrder: sortOrderSchema,
  media: z.array(mediaLinkSchema).optional(),
  seo: seoInputSchema.optional()
});

const propertyCreateSchema = z.object({
  projectId: optionalUuidSchema,
  referenceCode: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(200).optional(),
  shortDescription: z.string().trim().max(500).optional().nullable(),
  description: z.string().trim().optional().nullable(),
  listingType: z.nativeEnum(PropertyListingType),
  availability: z.nativeEnum(PropertyAvailability).optional(),
  price: z.coerce.number().nonnegative().optional().nullable(),
  currency: z.string().trim().min(3).max(10).optional(),
  priceLabel: z.string().trim().max(80).optional().nullable(),
  bedrooms: z.coerce.number().int().nonnegative().optional().nullable(),
  bathrooms: z.coerce.number().nonnegative().optional().nullable(),
  balconies: z.coerce.number().int().nonnegative().optional().nullable(),
  parkingSpaces: z.coerce.number().int().nonnegative().optional().nullable(),
  floorNumber: z.coerce.number().int().optional().nullable(),
  totalFloors: z.coerce.number().int().positive().optional().nullable(),
  areaSqft: z.coerce.number().positive().optional().nullable(),
  landAreaSqft: z.coerce.number().positive().optional().nullable(),
  furnishing: z.nativeEnum(FurnishingStatus).optional().nullable(),
  yearBuilt: z.coerce.number().int().min(1800).max(2200).optional().nullable(),
  availableFrom: nullableDateSchema,
  status: statusSchema,
  isFeatured: z.coerce.boolean().default(false).optional(),
  isDemo: z.coerce.boolean().default(false).optional(),
  sortOrder: sortOrderSchema,
  publishedAt: nullableDateSchema,
  categoryIds: z.array(uuidSchema).optional(),
  primaryCategoryId: uuidSchema.optional(),
  amenityIds: z.array(uuidSchema).optional(),
  address: addressSchema.optional(),
  media: z.array(mediaLinkSchema).optional(),
  seo: seoInputSchema.optional()
});

const projectCreateSchema = z.object({
  categoryId: optionalUuidSchema,
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(200).optional(),
  summary: z.string().trim().max(600).optional().nullable(),
  description: z.string().trim().optional().nullable(),
  developmentStatus: z.nativeEnum(ProjectDevelopmentStatus).optional(),
  completionPercent: z.coerce.number().min(0).max(100).optional().nullable(),
  startDate: nullableDateSchema,
  expectedCompletion: nullableDateSchema,
  completedAt: nullableDateSchema,
  status: statusSchema,
  isFeatured: z.coerce.boolean().default(false).optional(),
  isDemo: z.coerce.boolean().default(false).optional(),
  sortOrder: sortOrderSchema,
  publishedAt: nullableDateSchema,
  amenityIds: z.array(uuidSchema).optional(),
  address: addressSchema.optional(),
  media: z.array(mediaLinkSchema).optional(),
  seo: seoInputSchema.optional()
});

const amenityCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().max(140).optional(),
  icon: z.string().trim().max(80).optional().nullable(),
  status: statusSchema,
  sortOrder: sortOrderSchema
});

const serviceCreateSchema = z.object({
  categoryId: optionalUuidSchema,
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(200).optional(),
  summary: z.string().trim().min(1).max(600),
  description: z.string().trim().optional().nullable(),
  icon: z.string().trim().max(80).optional().nullable(),
  status: statusSchema,
  isFeatured: z.coerce.boolean().default(false).optional(),
  sortOrder: sortOrderSchema,
  publishedAt: nullableDateSchema,
  media: z.array(mediaLinkSchema).optional(),
  seo: seoInputSchema.optional()
});

const galleryAlbumCreateSchema = z.object({
  categoryId: optionalUuidSchema,
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(200).optional(),
  description: z.string().trim().optional().nullable(),
  status: statusSchema,
  sortOrder: sortOrderSchema,
  publishedAt: nullableDateSchema,
  items: z.array(galleryItemSchema).optional(),
  seo: seoInputSchema.optional()
});

const galleryItemCreateSchema = galleryItemSchema.extend({
  albumId: uuidSchema
});

const certificateCreateSchema = z.object({
  name: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(200).optional(),
  issuer: z.string().trim().min(1).max(180),
  certificateNo: z.string().trim().max(120).optional().nullable(),
  issuedAt: nullableDateSchema,
  expiresAt: nullableDateSchema,
  status: statusSchema,
  sortOrder: sortOrderSchema,
  media: z.array(mediaLinkSchema).optional(),
  seo: seoInputSchema.optional()
});

const clientCreateSchema = z.object({
  name: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(200).optional(),
  website: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  status: statusSchema,
  sortOrder: sortOrderSchema,
  contacts: z.array(clientContactSchema).optional(),
  media: z.array(mediaLinkSchema).optional(),
  seo: seoInputSchema.optional()
});

const testimonialCreateSchema = z.object({
  clientId: optionalUuidSchema,
  clientContactId: optionalUuidSchema,
  quote: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
  status: statusSchema,
  isFeatured: z.coerce.boolean().default(false).optional(),
  sortOrder: sortOrderSchema,
  publishedAt: nullableDateSchema
});

const faqCreateSchema = z.object({
  question: z.string().trim().min(1).max(255),
  answer: z.string().trim().min(1),
  group: z.string().trim().max(100).optional().nullable(),
  status: statusSchema,
  isFeatured: z.coerce.boolean().default(false).optional(),
  sortOrder: sortOrderSchema,
  publishedAt: nullableDateSchema
});

const partnerCreateSchema = z.object({
  name: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(200).optional(),
  website: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  status: statusSchema,
  sortOrder: sortOrderSchema,
  media: z.array(mediaLinkSchema).optional()
});

const postCreateSchema = z.object({
  categoryId: optionalUuidSchema,
  title: z.string().trim().min(1).max(220),
  slug: z.string().trim().max(240).optional(),
  excerpt: z.string().trim().max(600).optional().nullable(),
  body: z.string().trim().min(1),
  status: statusSchema,
  isFeatured: z.coerce.boolean().default(false).optional(),
  publishedAt: nullableDateSchema,
  tagNames: z.array(z.string().trim().min(1).max(80)).optional(),
  seo: seoInputSchema.optional()
});

const jobCreateSchema = z.object({
  departmentId: optionalUuidSchema,
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(220).optional(),
  location: z.string().trim().max(180).optional().nullable(),
  employmentType: z.nativeEnum(EmploymentType),
  description: z.string().trim().min(1),
  responsibilities: z.string().trim().optional().nullable(),
  requirements: z.string().trim().optional().nullable(),
  status: statusSchema,
  publishedAt: nullableDateSchema,
  closesAt: nullableDateSchema,
  seo: seoInputSchema.optional()
});

const applicationCreateSchema = z.object({
  jobPostingId: uuidSchema,
  resumeMediaId: optionalUuidSchema,
  fullName: z.string().trim().min(1).max(140),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().nullable(),
  coverLetter: z.string().trim().optional().nullable(),
  status: z.nativeEnum(ApplicationStatus).optional()
});

const factoryCreateSchema = z.object({
  name: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(200).optional(),
  description: z.string().trim().optional().nullable(),
  establishedYear: z.coerce.number().int().positive().optional().nullable(),
  totalAreaSqft: z.coerce.number().int().positive().optional().nullable(),
  employeeCount: z.coerce.number().int().positive().optional().nullable(),
  monthlyCapacity: z.string().trim().max(120).optional().nullable(),
  status: statusSchema,
  address: addressSchema.optional(),
  capabilities: z.array(factoryCapabilitySchema).optional(),
  media: z.array(mediaLinkSchema).optional(),
  seo: seoInputSchema.optional()
});

const contactLocationCreateSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(160).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(),
  status: statusSchema,
  sortOrder: sortOrderSchema,
  address: addressSchema
});

const websiteSettingCreateSchema = z.object({
  group: z.string().trim().min(1).max(80).optional(),
  key: z.string().trim().min(1).max(120),
  value: jsonSchema,
  mediaId: optionalUuidSchema,
  status: statusSchema
});

const seoCreateSchema = seoInputSchema.extend({
  title: z.string().trim().min(1).max(180),
  pageId: optionalUuidSchema,
  categoryId: optionalUuidSchema,
  propertyId: optionalUuidSchema,
  projectId: optionalUuidSchema,
  serviceId: optionalUuidSchema,
  galleryAlbumId: optionalUuidSchema,
  certificateId: optionalUuidSchema,
  clientId: optionalUuidSchema,
  blogPostId: optionalUuidSchema,
  jobPostingId: optionalUuidSchema,
  factoryId: optionalUuidSchema,
  downloadId: optionalUuidSchema
});

const downloadCreateSchema = z.object({
  categoryId: optionalUuidSchema,
  fileMediaId: uuidSchema,
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(200).optional(),
  description: z.string().trim().optional().nullable(),
  status: statusSchema,
  sortOrder: sortOrderSchema,
  publishedAt: nullableDateSchema,
  seo: seoInputSchema.optional()
});

const companyStatisticCreateSchema = z.object({
  label: z.string().trim().min(1).max(120),
  value: z.coerce.number(),
  prefix: z.string().trim().max(20).optional().nullable(),
  suffix: z.string().trim().max(20).optional().nullable(),
  note: z.string().trim().max(180).optional().nullable(),
  status: statusSchema,
  sortOrder: sortOrderSchema
});

function resource<T extends z.ZodRawShape>(
  config: Omit<CmsResourceConfig, "createSchema" | "updateSchema"> & { createSchema: z.ZodObject<T> }
): CmsResourceConfig {
  return {
    ...config,
    updateSchema: config.createSchema.partial() as z.ZodType<Record<string, unknown>>
  };
}

export const cmsResourceConfigs = {
  "hero-slides": resource({
    label: "Hero Slides",
    model: "heroSlide",
    permissionResource: "content",
    statusKind: "content",
    searchFields: ["eyebrow", "title", "subtitle"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "publishedAt", "title"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { page: true, media: true },
    filterFields: ["pageId"],
    slugSource: "title",
    createSchema: heroSlideCreateSchema
  }),
  categories: resource({
    label: "Categories",
    model: "category",
    permissionResource: "categories",
    statusKind: "record",
    searchFields: ["name", "slug", "description"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "name"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { parent: true, children: true, media: { include: { media: true } }, seo: true },
    filterFields: ["categoryType", "parentId"],
    slugSource: "name",
    createSchema: categoryCreateSchema
  }),
  properties: resource({
    label: "Properties",
    model: "property",
    permissionResource: "properties",
    statusKind: "content",
    searchFields: ["referenceCode", "title", "slug", "shortDescription", "description", "priceLabel"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "publishedAt", "title", "price", "areaSqft"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: {
      project: true,
      address: true,
      categories: { include: { category: true } },
      amenities: { include: { amenity: true } },
      media: { include: { media: true } },
      seo: true
    },
    filterFields: ["categoryId", "projectId", "listingType", "availability", "bedrooms", "isFeatured", "isDemo"],
    slugSource: "title",
    createSchema: propertyCreateSchema
  }),
  projects: resource({
    label: "Projects",
    model: "project",
    permissionResource: "projects",
    statusKind: "content",
    searchFields: ["title", "slug", "summary", "description"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "publishedAt", "title", "expectedCompletion"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: {
      category: true,
      address: true,
      amenities: { include: { amenity: true } },
      media: { include: { media: true } },
      seo: true,
      _count: { select: { properties: true } }
    },
    filterFields: ["categoryId", "developmentStatus", "isFeatured", "isDemo"],
    slugSource: "title",
    createSchema: projectCreateSchema
  }),
  amenities: resource({
    label: "Amenities",
    model: "amenity",
    permissionResource: "properties",
    statusKind: "record",
    searchFields: ["name", "slug", "icon"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "name"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: false,
    slugSource: "name",
    createSchema: amenityCreateSchema
  }),
  services: resource({
    label: "Services",
    model: "service",
    permissionResource: "services",
    statusKind: "content",
    searchFields: ["title", "slug", "summary", "description"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "publishedAt", "title"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { category: true, media: { include: { media: true } }, seo: true },
    filterFields: ["categoryId", "isFeatured"],
    slugSource: "title",
    createSchema: serviceCreateSchema
  }),
  gallery: resource({
    label: "Gallery Albums",
    model: "galleryAlbum",
    permissionResource: "gallery",
    statusKind: "content",
    searchFields: ["title", "slug", "description"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "publishedAt", "title"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { category: true, items: { include: { media: true } }, seo: true },
    filterFields: ["categoryId"],
    slugSource: "title",
    createSchema: galleryAlbumCreateSchema
  }),
  "gallery-items": resource({
    label: "Gallery Items",
    model: "galleryItem",
    permissionResource: "gallery",
    statusKind: "content",
    searchFields: ["title", "caption"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "title"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { album: true, media: true },
    filterFields: ["albumId"],
    createSchema: galleryItemCreateSchema
  }),
  blogs: resource({
    label: "Blogs",
    model: "blogPost",
    permissionResource: "blog",
    statusKind: "content",
    searchFields: ["title", "slug", "excerpt", "body"],
    sortableFields: ["createdAt", "updatedAt", "publishedAt", "title"],
    defaultSortBy: "createdAt",
    defaultSortOrder: "desc",
    softDelete: true,
    include: { category: true, author: true, tags: { include: { blogTag: true } }, seo: true },
    forcedWhere: { postType: "BLOG" },
    forcedData: { postType: "BLOG" },
    filterFields: ["categoryId", "isFeatured"],
    slugSource: "title",
    createSchema: postCreateSchema
  }),
  news: resource({
    label: "News",
    model: "blogPost",
    permissionResource: "blog",
    statusKind: "content",
    searchFields: ["title", "slug", "excerpt", "body"],
    sortableFields: ["createdAt", "updatedAt", "publishedAt", "title"],
    defaultSortBy: "createdAt",
    defaultSortOrder: "desc",
    softDelete: true,
    include: { category: true, author: true, tags: { include: { blogTag: true } }, seo: true },
    forcedWhere: { postType: "NEWS" },
    forcedData: { postType: "NEWS" },
    filterFields: ["categoryId", "isFeatured"],
    slugSource: "title",
    createSchema: postCreateSchema
  }),
  certificates: resource({
    label: "Certificates",
    model: "certificate",
    permissionResource: "certificates",
    statusKind: "record",
    searchFields: ["name", "slug", "issuer", "certificateNo"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "issuedAt", "expiresAt", "name"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { media: { include: { media: true } }, seo: true },
    slugSource: "name",
    createSchema: certificateCreateSchema
  }),
  clients: resource({
    label: "Clients",
    model: "client",
    permissionResource: "clients",
    statusKind: "record",
    searchFields: ["name", "slug", "website", "description"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "name"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { contacts: true, media: { include: { media: true } }, seo: true },
    slugSource: "name",
    createSchema: clientCreateSchema
  }),
  testimonials: resource({
    label: "Testimonials",
    model: "testimonial",
    permissionResource: "testimonials",
    statusKind: "content",
    searchFields: ["quote"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "publishedAt", "rating"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { client: true, clientContact: true },
    filterFields: ["clientId", "clientContactId", "isFeatured"],
    createSchema: testimonialCreateSchema
  }),
  faqs: resource({
    label: "FAQs",
    model: "faq",
    permissionResource: "content",
    statusKind: "content",
    searchFields: ["question", "answer", "group"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "publishedAt", "question"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    filterFields: ["group", "isFeatured"],
    createSchema: faqCreateSchema
  }),
  partners: resource({
    label: "Partners",
    model: "partner",
    permissionResource: "partners",
    statusKind: "record",
    searchFields: ["name", "slug", "website", "description"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "name"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { media: { include: { media: true } } },
    slugSource: "name",
    createSchema: partnerCreateSchema
  }),
  "career-jobs": resource({
    label: "Career Jobs",
    model: "jobPosting",
    permissionResource: "careers",
    statusKind: "career",
    searchFields: ["title", "slug", "location", "description", "responsibilities", "requirements"],
    sortableFields: ["createdAt", "updatedAt", "publishedAt", "closesAt", "title"],
    defaultSortBy: "createdAt",
    defaultSortOrder: "desc",
    softDelete: true,
    include: { department: true, seo: true },
    filterFields: ["departmentId"],
    slugSource: "title",
    createSchema: jobCreateSchema
  }),
  applications: resource({
    label: "Applications",
    model: "jobApplication",
    permissionResource: "applications",
    statusKind: "application",
    searchFields: ["fullName", "email", "phone", "coverLetter"],
    sortableFields: ["createdAt", "updatedAt", "fullName"],
    defaultSortBy: "createdAt",
    defaultSortOrder: "desc",
    softDelete: true,
    include: { jobPosting: true, resume: true },
    filterFields: ["jobPostingId"],
    createSchema: applicationCreateSchema
  }),
  "factory-information": resource({
    label: "Factory Information",
    model: "factory",
    permissionResource: "factories",
    statusKind: "record",
    searchFields: ["name", "slug", "description", "monthlyCapacity"],
    sortableFields: ["createdAt", "updatedAt", "name", "employeeCount"],
    defaultSortBy: "createdAt",
    defaultSortOrder: "desc",
    softDelete: true,
    include: { address: true, capabilities: true, media: { include: { media: true } }, seo: true },
    slugSource: "name",
    createSchema: factoryCreateSchema
  }),
  "contact-details": resource({
    label: "Contact Details",
    model: "contactLocation",
    permissionResource: "contact",
    statusKind: "record",
    searchFields: ["name", "email", "phone"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "name"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { address: true },
    createSchema: contactLocationCreateSchema
  }),
  "company-information": resource({
    label: "Company Information",
    model: "websiteSetting",
    permissionResource: "settings",
    statusKind: "content",
    searchFields: ["group", "key"],
    sortableFields: ["createdAt", "updatedAt", "key", "group"],
    defaultSortBy: "key",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { media: true, updatedBy: true },
    forcedWhere: { group: "company" },
    forcedData: { group: "company" },
    createSchema: websiteSettingCreateSchema
  }),
  "social-media": resource({
    label: "Social Media",
    model: "websiteSetting",
    permissionResource: "settings",
    statusKind: "content",
    searchFields: ["group", "key"],
    sortableFields: ["createdAt", "updatedAt", "key", "group"],
    defaultSortBy: "key",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { media: true, updatedBy: true },
    forcedWhere: { group: "social" },
    forcedData: { group: "social" },
    createSchema: websiteSettingCreateSchema
  }),
  footer: resource({
    label: "Footer",
    model: "websiteSetting",
    permissionResource: "settings",
    statusKind: "content",
    searchFields: ["group", "key"],
    sortableFields: ["createdAt", "updatedAt", "key", "group"],
    defaultSortBy: "key",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { media: true, updatedBy: true },
    forcedWhere: { group: "footer" },
    forcedData: { group: "footer" },
    createSchema: websiteSettingCreateSchema
  }),
  menus: resource({
    label: "Menus",
    model: "websiteSetting",
    permissionResource: "settings",
    statusKind: "content",
    searchFields: ["group", "key"],
    sortableFields: ["createdAt", "updatedAt", "key", "group"],
    defaultSortBy: "key",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { media: true, updatedBy: true },
    forcedWhere: { group: "menus" },
    forcedData: { group: "menus" },
    createSchema: websiteSettingCreateSchema
  }),
  "website-settings": resource({
    label: "Website Settings",
    model: "websiteSetting",
    permissionResource: "settings",
    statusKind: "content",
    searchFields: ["group", "key"],
    sortableFields: ["createdAt", "updatedAt", "key", "group"],
    defaultSortBy: "key",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { media: true, updatedBy: true },
    filterFields: ["group"],
    createSchema: websiteSettingCreateSchema.extend({
      group: z.string().trim().min(1).max(80)
    })
  }),
  seo: resource({
    label: "SEO",
    model: "seoMetadata",
    permissionResource: "seo",
    statusKind: "content",
    searchFields: ["title", "description", "keywords", "canonicalUrl"],
    sortableFields: ["createdAt", "updatedAt", "title"],
    defaultSortBy: "updatedAt",
    defaultSortOrder: "desc",
    softDelete: true,
    include: { ogImage: true },
    createSchema: seoCreateSchema
  }),
  downloads: resource({
    label: "Downloads",
    model: "download",
    permissionResource: "downloads",
    statusKind: "content",
    searchFields: ["title", "slug", "description"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "publishedAt", "title"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    include: { category: true, fileMedia: true, seo: true },
    filterFields: ["categoryId"],
    slugSource: "title",
    createSchema: downloadCreateSchema
  }),
  "company-statistics": resource({
    label: "Company Statistics",
    model: "companyStatistic",
    permissionResource: "settings",
    statusKind: "record",
    searchFields: ["label", "note"],
    sortableFields: ["sortOrder", "createdAt", "updatedAt", "label", "value"],
    defaultSortBy: "sortOrder",
    defaultSortOrder: "asc",
    softDelete: true,
    createSchema: companyStatisticCreateSchema
  })
} as const satisfies Record<string, CmsResourceConfig>;

export type CmsResourceKey = keyof typeof cmsResourceConfigs;

export function getCmsResourceConfig(resourceName: string) {
  return cmsResourceConfigs[resourceName as CmsResourceKey];
}

export const cmsResourceNames = Object.keys(cmsResourceConfigs);

export const cmsStatusEnums = {
  content: ContentStatus,
  record: RecordStatus,
  career: CareerStatus,
  application: ApplicationStatus
};
