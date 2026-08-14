import { Prisma } from "@prisma/client";
import { z } from "zod";
import { InteriorPortfolioRepository } from "../repositories/content.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";
import { createSlug } from "../utils/slug";
import {
  interiorPortfolioBodySchema,
  interiorPortfolioListSchema
} from "../validators/content.validator";

type InteriorPortfolioListQuery = z.infer<typeof interiorPortfolioListSchema>["query"];
type InteriorPortfolioInput = z.infer<typeof interiorPortfolioBodySchema>;

export class InteriorPortfolioService {
  constructor(private readonly portfolioRepository = new InteriorPortfolioRepository()) {}

  async list(query: InteriorPortfolioListQuery, admin = false) {
    const where: Prisma.InteriorPortfolioItemWhereInput = {};
    if (!admin) where.isPublished = true;
    else if (query.published !== undefined) where.isPublished = query.published;
    if (query.featured !== undefined) where.isFeatured = query.featured;
    if (query.category) where.category = { contains: query.category, mode: "insensitive" };

    const [items, total] = await Promise.all([
      this.portfolioRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      this.portfolioRepository.count(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async create(input: InteriorPortfolioInput) {
    return this.portfolioRepository.create({
      ...input,
      slug: input.slug ? createSlug(input.slug) : createSlug(input.title)
    });
  }

  async update(id: string, input: Partial<InteriorPortfolioInput>) {
    await this.ensureExists(id);
    return this.portfolioRepository.update(id, {
      ...input,
      slug: input.slug ? createSlug(input.slug) : undefined
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.portfolioRepository.delete(id);
    return null;
  }

  private async ensureExists(id: string) {
    const item = await this.portfolioRepository.findById(id);
    if (!item) {
      throw new AppError("Interior portfolio item was not found", 404);
    }
    return item;
  }
}
