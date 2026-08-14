import { Prisma, PropertyPurpose } from "@prisma/client";
import { z } from "zod";
import { PropertyRepository } from "../repositories/property.repository";
import { PropertyCategoryRepository } from "../repositories/propertyCategory.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";
import { createSlug } from "../utils/slug";
import {
  propertyBodySchema,
  propertyCategoryBodySchema,
  propertyListSchema
} from "../validators/property.validator";

type PropertyListQuery = z.infer<typeof propertyListSchema>["query"];
type PropertyInput = z.infer<typeof propertyBodySchema>;
type PropertyCategoryInput = z.infer<typeof propertyCategoryBodySchema>;

export class PropertyService {
  constructor(
    private readonly propertyRepository = new PropertyRepository(),
    private readonly categoryRepository = new PropertyCategoryRepository()
  ) {}

  async list(query: PropertyListQuery, admin = false) {
    const page = query.page;
    const limit = query.limit;
    const where = this.buildWhere(query, admin);

    const [items, total] = await Promise.all([
      this.propertyRepository.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      this.propertyRepository.count(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, page, limit)
    };
  }

  async getBySlug(slug: string, admin = false) {
    const item = await this.propertyRepository.findBySlug(slug, !admin);
    if (!item) {
      throw new AppError("Property was not found", 404);
    }
    return item;
  }

  async create(input: PropertyInput) {
    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      if (!category) {
        throw new AppError("Property category was not found", 404);
      }
    }

    return this.propertyRepository.create({
      ...input,
      slug: input.slug ? createSlug(input.slug) : createSlug(input.name),
      categoryId: input.categoryId ?? null,
      beds: input.beds ?? null,
      baths: input.baths ?? null
    });
  }

  async update(id: string, input: Partial<PropertyInput>) {
    await this.ensureExists(id);

    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      if (!category) {
        throw new AppError("Property category was not found", 404);
      }
    }

    return this.propertyRepository.update(id, {
      ...input,
      slug: input.slug ? createSlug(input.slug) : undefined,
      categoryId: input.categoryId === undefined ? undefined : input.categoryId
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.propertyRepository.delete(id);
    return null;
  }

  private async ensureExists(id: string) {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new AppError("Property was not found", 404);
    }
    return property;
  }

  private buildWhere(query: PropertyListQuery, admin: boolean): Prisma.PropertyWhereInput {
    const where: Prisma.PropertyWhereInput = {};

    if (!admin) {
      where.isPublished = true;
    } else if (query.published !== undefined) {
      where.isPublished = query.published;
    }

    if (query.featured !== undefined) where.isFeatured = query.featured;
    if (query.type) where.type = { contains: query.type, mode: "insensitive" };
    if (query.location) where.location = { contains: query.location, mode: "insensitive" };
    if (query.status) where.status = query.status;
    if (query.purpose) {
      where.purpose =
        query.purpose === PropertyPurpose.BUY || query.purpose === PropertyPurpose.RENT
          ? { in: [query.purpose, PropertyPurpose.BOTH] }
          : query.purpose;
    }
    if (query.category) {
      where.category = {
        OR: [
          { slug: { equals: query.category, mode: "insensitive" } },
          { name: { contains: query.category, mode: "insensitive" } }
        ]
      };
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.priceValue = {
        gte: query.minPrice,
        lte: query.maxPrice
      };
    }
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { location: { contains: query.q, mode: "insensitive" } },
        { type: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } }
      ];
    }

    return where;
  }
}

export class PropertyCategoryService {
  constructor(private readonly categoryRepository = new PropertyCategoryRepository()) {}

  async list(admin = false) {
    return this.categoryRepository.findMany({
      where: admin ? {} : { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });
  }

  async adminList(query: { page: number; limit: number }) {
    const [items, total] = await Promise.all([
      this.categoryRepository.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
      }),
      this.categoryRepository.count({})
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async create(input: PropertyCategoryInput) {
    return this.categoryRepository.create({
      ...input,
      slug: input.slug ? createSlug(input.slug) : createSlug(input.name)
    });
  }

  async update(id: string, input: Partial<PropertyCategoryInput>) {
    await this.ensureExists(id);
    return this.categoryRepository.update(id, {
      ...input,
      slug: input.slug ? createSlug(input.slug) : undefined
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.categoryRepository.delete(id);
    return null;
  }

  private async ensureExists(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Property category was not found", 404);
    }
    return category;
  }
}
