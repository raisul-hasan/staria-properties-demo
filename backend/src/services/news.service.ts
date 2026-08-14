import { Prisma } from "@prisma/client";
import { z } from "zod";
import { NewsRepository } from "../repositories/content.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";
import { createSlug } from "../utils/slug";
import { newsBodySchema, newsListSchema } from "../validators/content.validator";

type NewsListQuery = z.infer<typeof newsListSchema>["query"];
type NewsInput = z.infer<typeof newsBodySchema>;

export class NewsService {
  constructor(private readonly newsRepository = new NewsRepository()) {}

  async list(query: NewsListQuery, admin = false) {
    const where = this.buildWhere(query, admin);
    const [items, total] = await Promise.all([
      this.newsRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }]
      }),
      this.newsRepository.count(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async getBySlug(slug: string, admin = false) {
    const article = await this.newsRepository.findBySlug(slug, !admin);
    if (!article) {
      throw new AppError("Article was not found", 404);
    }
    return article;
  }

  async create(input: NewsInput) {
    return this.newsRepository.create({
      ...input,
      slug: input.slug ? createSlug(input.slug) : createSlug(input.title)
    });
  }

  async update(id: string, input: Partial<NewsInput>) {
    await this.ensureExists(id);
    return this.newsRepository.update(id, {
      ...input,
      slug: input.slug ? createSlug(input.slug) : undefined
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.newsRepository.delete(id);
    return null;
  }

  private async ensureExists(id: string) {
    const article = await this.newsRepository.findById(id);
    if (!article) {
      throw new AppError("Article was not found", 404);
    }
    return article;
  }

  private buildWhere(query: NewsListQuery, admin: boolean): Prisma.NewsArticleWhereInput {
    const where: Prisma.NewsArticleWhereInput = {};
    if (!admin) where.isPublished = true;
    else if (query.published !== undefined) where.isPublished = query.published;
    if (query.featured !== undefined) where.isFeatured = query.featured;
    if (query.category) where.category = { contains: query.category, mode: "insensitive" };
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: "insensitive" } },
        { category: { contains: query.q, mode: "insensitive" } },
        { excerpt: { contains: query.q, mode: "insensitive" } },
        { content: { contains: query.q, mode: "insensitive" } }
      ];
    }
    return where;
  }
}
