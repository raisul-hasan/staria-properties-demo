import {
  AdminAction,
  ApplicationStatus,
  CareerStatus,
  ContentStatus,
  Prisma,
  RecordStatus
} from "@prisma/client";
import {
  CmsResourceConfig,
  cmsListQuerySchema,
  getCmsResourceConfig
} from "../config/cmsResources";
import { AuthRepository } from "../repositories/auth.repository";
import { CmsRepository } from "../repositories/cms.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";
import { createSlug } from "../utils/slug";
import { RequestMeta } from "./auth.service";

type CmsQuery = ReturnType<typeof cmsListQuerySchema.parse>;
type CmsInput = Record<string, unknown>;

export class CmsService {
  constructor(
    private readonly cmsRepository = new CmsRepository(),
    private readonly authRepository = new AuthRepository()
  ) {}

  async list(resourceName: string, queryInput: unknown) {
    const config = this.getConfig(resourceName);
    const query = cmsListQuerySchema.parse(queryInput);
    const where = this.buildWhere(config, query);
    const orderBy = this.buildOrderBy(config, query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      this.cmsRepository.findMany(config.model, {
        where,
        include: config.include,
        orderBy,
        skip,
        take: query.limit
      }),
      this.cmsRepository.count(config.model, where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async get(resourceName: string, id: string) {
    const config = this.getConfig(resourceName);
    const item = await this.cmsRepository.findOne(config.model, this.recordWhere(config, id), config.include);

    if (!item) {
      throw new AppError(`${config.label} record was not found`, 404);
    }

    return item;
  }

  async getPublished(resourceName: string, identifier: string) {
    const config = this.getConfig(resourceName);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    const identity = isUuid ? { id: identifier } : { slug: identifier };
    const item = await this.cmsRepository.findOne(
      config.model,
      {
        ...identity,
        ...(config.forcedWhere ?? {}),
        ...(config.softDelete ? { deletedAt: null } : {}),
        status: this.mapStatus(config.statusKind, "PUBLISHED")
      },
      config.include
    );

    if (!item) {
      throw new AppError(`${config.label} record was not found`, 404);
    }

    return item;
  }

  async create(resourceName: string, input: CmsInput, actorId: string, meta: RequestMeta) {
    const config = this.getConfig(resourceName);
    const parsed = config.createSchema.parse(input);
    const data = await this.prepareData(resourceName, config, parsed, "create", actorId);
    const created = await this.cmsRepository.create(config.model, data, config.include);

    await this.audit(actorId, AdminAction.CREATE, config, created, undefined, meta);
    return created;
  }

  async update(resourceName: string, id: string, input: CmsInput, actorId: string, meta: RequestMeta) {
    const config = this.getConfig(resourceName);
    const before = await this.get(resourceName, id);
    const parsed = config.updateSchema.parse(input);
    const data = await this.prepareData(resourceName, config, parsed, "update", actorId);
    const updated = await this.cmsRepository.update(config.model, id, data, config.include);

    await this.audit(actorId, AdminAction.UPDATE, config, updated, before, meta);
    return updated;
  }

  async publish(resourceName: string, id: string, actorId: string, meta: RequestMeta) {
    const config = this.getConfig(resourceName);
    const before = await this.get(resourceName, id);
    const data = this.statusTransitionData(config, "publish");
    const updated = await this.cmsRepository.update(config.model, id, data, config.include);

    await this.audit(actorId, AdminAction.PUBLISH, config, updated, before, meta);
    return updated;
  }

  async draft(resourceName: string, id: string, actorId: string, meta: RequestMeta) {
    const config = this.getConfig(resourceName);
    const before = await this.get(resourceName, id);
    const data = this.statusTransitionData(config, "draft");
    const updated = await this.cmsRepository.update(config.model, id, data, config.include);

    await this.audit(actorId, AdminAction.STATUS_CHANGE, config, updated, before, meta);
    return updated;
  }

  async softDelete(resourceName: string, id: string, actorId: string, meta: RequestMeta) {
    const config = this.getConfig(resourceName);
    if (!config.softDelete) {
      throw new AppError(`${config.label} does not support soft delete`, 400);
    }

    const before = await this.get(resourceName, id);
    const deleted = await this.cmsRepository.update(config.model, id, { deletedAt: new Date() }, config.include);

    await this.audit(actorId, AdminAction.DELETE, config, deleted, before, meta);
    return deleted;
  }

  async restore(resourceName: string, id: string, actorId: string, meta: RequestMeta) {
    const config = this.getConfig(resourceName);
    if (!config.softDelete) {
      throw new AppError(`${config.label} does not support restore`, 400);
    }

    const before = await this.cmsRepository.findById(config.model, id, config.include);
    if (!before) {
      throw new AppError(`${config.label} record was not found`, 404);
    }

    const restored = await this.cmsRepository.update(config.model, id, { deletedAt: null }, config.include);

    await this.audit(actorId, AdminAction.UPDATE, config, restored, before, meta);
    return restored;
  }

  private getConfig(resourceName: string) {
    const config = getCmsResourceConfig(resourceName);
    if (!config) {
      throw new AppError(`Unsupported CMS resource: ${resourceName}`, 404);
    }
    return config;
  }

  private buildWhere(config: CmsResourceConfig, query: CmsQuery) {
    const where: Record<string, unknown> = {
      ...(config.forcedWhere ?? {})
    };

    if (config.softDelete) {
      if (query.deletedOnly) {
        where.deletedAt = { not: null };
      } else if (!query.includeDeleted) {
        where.deletedAt = null;
      }
    }

    if (query.status) {
      where.status = this.mapStatus(config.statusKind, query.status);
    }

    if (query.search && config.searchFields.length > 0) {
      where.OR = config.searchFields.map((field) => ({
        [field]: {
          contains: query.search,
          mode: "insensitive"
        }
      }));
    }

    if (query.createdFrom || query.createdTo) {
      where.createdAt = {
        ...(query.createdFrom ? { gte: query.createdFrom } : {}),
        ...(query.createdTo ? { lte: query.createdTo } : {})
      };
    }

    (config.filterFields ?? []).forEach((field) => {
      const value = query[field as keyof CmsQuery];
      if (value === undefined || value === null || value === "") return;

      if (config.model === "property" && field === "categoryId") {
        where.categories = { some: { categoryId: value } };
        return;
      }

      where[field] = value;
    });

    if (config.model === "property" && (query.minPrice !== undefined || query.maxPrice !== undefined)) {
      where.price = {
        ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {})
      };
    }

    return where;
  }

  private buildOrderBy(config: CmsResourceConfig, query: CmsQuery) {
    const sortBy = query.sortBy ?? config.defaultSortBy;
    if (!config.sortableFields.includes(sortBy)) {
      throw new AppError(`Unsupported sort field for ${config.label}: ${sortBy}`, 400);
    }

    return {
      [sortBy]: query.sortOrder ?? config.defaultSortOrder
    };
  }

  private recordWhere(config: CmsResourceConfig, id: string) {
    return {
      id,
      ...(config.forcedWhere ?? {}),
      ...(config.softDelete ? { deletedAt: null } : {})
    };
  }

  private async prepareData(
    resourceName: string,
    config: CmsResourceConfig,
    input: CmsInput,
    operation: "create" | "update",
    actorId: string
  ) {
    const data = this.cleanObject({
      ...input,
      ...(config.forcedData ?? {})
    });

    if (config.slugSource && !data.slug && data[config.slugSource]) {
      data.slug = createSlug(String(data[config.slugSource]));
    }

    if (data.status) {
      data.status = this.mapStatus(config.statusKind, String(data.status));
      this.applyPublishedAt(config, data);
    }

    if (config.model === "websiteSetting") {
      data.updatedById = actorId;
    }

    if (config.model === "blogPost" && operation === "create") {
      data.authorId = actorId;
    }

    await this.prepareRelations(resourceName, data, operation);
    return data;
  }

  private async prepareRelations(resourceName: string, data: CmsInput, operation: "create" | "update") {
    this.prepareSeo(data, operation);

    switch (resourceName) {
      case "categories":
        this.prepareMediaRelation(data, "media", operation);
        break;
      case "properties":
        this.preparePropertyRelations(data, operation);
        break;
      case "projects":
        this.prepareProjectRelations(data, operation);
        break;
      case "services":
        this.prepareMediaRelation(data, "media", operation);
        break;
      case "gallery":
        this.prepareGalleryAlbumRelations(data, operation);
        break;
      case "certificates":
        this.prepareMediaRelation(data, "media", operation);
        break;
      case "clients":
        this.prepareClientRelations(data, operation);
        break;
      case "partners":
        this.prepareMediaRelation(data, "media", operation);
        break;
      case "blogs":
      case "news":
        await this.prepareBlogTags(data, operation);
        break;
      case "factory-information":
        this.prepareFactoryRelations(data, operation);
        break;
      case "contact-details":
        this.prepareAddressRelation(data, operation);
        break;
      default:
        break;
    }
  }

  private prepareSeo(data: CmsInput, operation: "create" | "update") {
    const seo = data.seo;
    delete data.seo;

    if (!this.isObject(seo)) return;

    const fallbackTitle = String(data.title ?? data.name ?? data.label ?? "SEO Metadata");
    const seoData = this.cleanObject({
      title: seo.title ?? fallbackTitle,
      description: seo.description,
      keywords: seo.keywords,
      canonicalUrl: seo.canonicalUrl,
      robots: seo.robots,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImageId: seo.ogImageId,
      structuredData: seo.structuredData,
      status: seo.status ? this.mapStatus("content", String(seo.status)) : undefined
    });

    data.seo =
      operation === "create"
        ? { create: seoData }
        : {
            upsert: {
              create: seoData,
              update: seoData
            }
          };
  }

  private preparePropertyRelations(data: CmsInput, operation: "create" | "update") {
    const categoryIds = this.stringArray(data.categoryIds);
    const primaryCategoryId = typeof data.primaryCategoryId === "string" ? data.primaryCategoryId : undefined;
    const shouldUpdateCategories = Array.isArray(data.categoryIds) || Boolean(primaryCategoryId);
    delete data.categoryIds;
    delete data.primaryCategoryId;

    if (shouldUpdateCategories) {
      const ids = [...new Set([primaryCategoryId, ...categoryIds].filter(Boolean) as string[])];
      data.categories = {
        ...(operation === "update" ? { deleteMany: {} } : {}),
        create: ids.map((categoryId, index) => ({
          category: { connect: { id: categoryId } },
          isPrimary: primaryCategoryId ? categoryId === primaryCategoryId : index === 0
        }))
      };
    }

    this.prepareAddressRelation(data, operation);
    this.prepareMediaRelation(data, "media", operation);
    this.prepareAmenityRelations(data, operation);
  }

  private prepareProjectRelations(data: CmsInput, operation: "create" | "update") {
    this.prepareAddressRelation(data, operation);
    this.prepareMediaRelation(data, "media", operation);
    this.prepareAmenityRelations(data, operation);
  }

  private prepareAmenityRelations(data: CmsInput, operation: "create" | "update") {
    if (!Array.isArray(data.amenityIds)) return;

    const amenityIds = [...new Set(this.stringArray(data.amenityIds))];
    delete data.amenityIds;
    data.amenities = {
      ...(operation === "update" ? { deleteMany: {} } : {}),
      create: amenityIds.map((amenityId) => ({
        amenity: { connect: { id: amenityId } }
      }))
    };
  }

  private prepareGalleryAlbumRelations(data: CmsInput, operation: "create" | "update") {
    if (!Array.isArray(data.items)) return;

    const items = data.items.filter(this.isObject);
    data.items = {
      ...(operation === "update" ? { deleteMany: {} } : {}),
      create: items.map((item) =>
        this.cleanObject({
          media: { connect: { id: item.mediaId } },
          title: item.title,
          caption: item.caption,
          status: item.status ? this.mapStatus("content", String(item.status)) : undefined,
          sortOrder: item.sortOrder
        })
      )
    };
  }

  private prepareClientRelations(data: CmsInput, operation: "create" | "update") {
    this.prepareMediaRelation(data, "media", operation);

    if (!Array.isArray(data.contacts)) return;

    const contacts = data.contacts.filter(this.isObject);
    data.contacts = {
      ...(operation === "update" ? { deleteMany: {} } : {}),
      create: contacts.map((contact) =>
        this.cleanObject({
          name: contact.name,
          designation: contact.designation,
          email: contact.email,
          phone: contact.phone
        })
      )
    };
  }

  private async prepareBlogTags(data: CmsInput, operation: "create" | "update") {
    if (!Array.isArray(data.tagNames)) return;

    const tagNames = data.tagNames.map((tag) => String(tag).trim()).filter(Boolean);
    const tags = await this.cmsRepository.upsertBlogTags([...new Set(tagNames)]);

    delete data.tagNames;
    data.tags = {
      ...(operation === "update" ? { deleteMany: {} } : {}),
      create: tags.map((tag) => ({
        blogTag: { connect: { id: tag.id } }
      }))
    };
  }

  private prepareFactoryRelations(data: CmsInput, operation: "create" | "update") {
    this.prepareAddressRelation(data, operation);
    this.prepareMediaRelation(data, "media", operation);

    if (!Array.isArray(data.capabilities)) return;

    const capabilities = data.capabilities.filter(this.isObject);
    data.capabilities = {
      ...(operation === "update" ? { deleteMany: {} } : {}),
      create: capabilities.map((capability) =>
        this.cleanObject({
          name: capability.name,
          value: capability.value,
          unit: capability.unit,
          sortOrder: capability.sortOrder
        })
      )
    };
  }

  private prepareAddressRelation(data: CmsInput, operation: "create" | "update") {
    const address = data.address;
    delete data.address;

    if (!this.isObject(address)) return;

    const addressData = this.cleanObject({
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      latitude: address.latitude,
      longitude: address.longitude
    });

    data.address =
      operation === "create"
        ? { create: addressData }
        : {
            upsert: {
              create: addressData,
              update: addressData
            }
          };
  }

  private prepareMediaRelation(data: CmsInput, relationName: string, operation: "create" | "update") {
    const media = data[relationName];
    if (!Array.isArray(media)) return;

    const mediaLinks = media.filter(this.isObject);
    data[relationName] = {
      ...(operation === "update" ? { deleteMany: {} } : {}),
      create: mediaLinks.map((link) =>
        this.cleanObject({
          media: { connect: { id: link.mediaId } },
          role: link.role,
          sortOrder: link.sortOrder
        })
      )
    };
  }

  private statusTransitionData(config: CmsResourceConfig, transition: "publish" | "draft") {
    if (config.statusKind === "application") {
      throw new AppError(`${config.label} does not support draft/publish transitions`, 400);
    }

    const status =
      transition === "publish"
        ? this.mapStatus(config.statusKind, "PUBLISHED")
        : this.mapStatus(config.statusKind, "DRAFT");
    const data: CmsInput = { status };

    if (this.hasPublishedAt(config)) {
      data.publishedAt = transition === "publish" ? new Date() : null;
    }

    return data;
  }

  private applyPublishedAt(config: CmsResourceConfig, data: CmsInput) {
    if (!this.hasPublishedAt(config)) return;

    const status = String(data.status);
    const publishedStatuses = [ContentStatus.PUBLISHED, CareerStatus.OPEN].map(String);
    const draftStatuses = [ContentStatus.DRAFT, CareerStatus.DRAFT].map(String);

    if (publishedStatuses.includes(status) && data.publishedAt === undefined) {
      data.publishedAt = new Date();
    }

    if (draftStatuses.includes(status) && data.publishedAt === undefined) {
      data.publishedAt = null;
    }
  }

  private hasPublishedAt(config: CmsResourceConfig) {
    return config.sortableFields.includes("publishedAt");
  }

  private mapStatus(kind: CmsResourceConfig["statusKind"], value: string) {
    const status = value.trim().toUpperCase().replace(/-/g, "_");

    if (kind === "content") {
      if (status === "ACTIVE") return ContentStatus.PUBLISHED;
      if (status === "INACTIVE") return ContentStatus.DRAFT;
      if (status in ContentStatus) return status as ContentStatus;
    }

    if (kind === "record") {
      if (status === "DRAFT") return RecordStatus.INACTIVE;
      if (status === "PUBLISHED") return RecordStatus.ACTIVE;
      if (status in RecordStatus) return status as RecordStatus;
    }

    if (kind === "career") {
      if (status === "PUBLISHED") return CareerStatus.OPEN;
      if (status in CareerStatus) return status as CareerStatus;
    }

    if (kind === "application" && status in ApplicationStatus) {
      return status as ApplicationStatus;
    }

    throw new AppError(`Unsupported status value: ${value}`, 400);
  }

  private stringArray(value: unknown) {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  }

  private cleanObject(input: CmsInput) {
    return Object.entries(input).reduce<CmsInput>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  private isObject(value: unknown): value is CmsInput {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private audit(
    actorId: string,
    action: AdminAction,
    config: CmsResourceConfig,
    afterData: unknown,
    beforeData: unknown,
    meta: RequestMeta
  ) {
    return this.authRepository.createAuditLog({
      actorId,
      action,
      entityType: config.model,
      entityId: this.getEntityId(afterData),
      beforeData: beforeData ? this.toAuditJson(beforeData) : undefined,
      afterData: this.toAuditJson(afterData),
      ...meta
    });
  }

  private getEntityId(value: unknown) {
    if (this.isObject(value) && typeof value.id === "string") {
      return value.id;
    }
    return null;
  }

  private toAuditJson(value: unknown) {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }
}
