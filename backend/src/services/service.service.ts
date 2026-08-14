import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ServiceRepository } from "../repositories/service.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";
import { createSlug } from "../utils/slug";
import { serviceBodySchema, serviceListSchema } from "../validators/service.validator";

type ServiceListQuery = z.infer<typeof serviceListSchema>["query"];
type ServiceInput = z.infer<typeof serviceBodySchema>;

export class ServiceService {
  constructor(private readonly serviceRepository = new ServiceRepository()) {}

  async list(query: ServiceListQuery, admin = false) {
    const where = this.buildWhere(query, admin);
    const [items, total] = await Promise.all([
      this.serviceRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      this.serviceRepository.count(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async getBySlug(slug: string, admin = false) {
    const item = await this.serviceRepository.findBySlug(slug, !admin);
    if (!item) {
      throw new AppError("Service was not found", 404);
    }
    return item;
  }

  async create(input: ServiceInput) {
    return this.serviceRepository.create({
      ...input,
      slug: input.slug ? createSlug(input.slug) : createSlug(input.title)
    });
  }

  async update(id: string, input: Partial<ServiceInput>) {
    await this.ensureExists(id);
    return this.serviceRepository.update(id, {
      ...input,
      slug: input.slug ? createSlug(input.slug) : undefined
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.serviceRepository.delete(id);
    return null;
  }

  private async ensureExists(id: string) {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new AppError("Service was not found", 404);
    }
    return service;
  }

  private buildWhere(query: ServiceListQuery, admin: boolean): Prisma.ServiceWhereInput {
    const where: Prisma.ServiceWhereInput = {};
    if (!admin) where.isPublished = true;
    else if (query.published !== undefined) where.isPublished = query.published;
    if (query.featured !== undefined) where.isFeatured = query.featured;
    if (query.division) where.division = query.division;
    if (query.category) where.category = { contains: query.category, mode: "insensitive" };
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: "insensitive" } },
        { category: { contains: query.q, mode: "insensitive" } },
        { summary: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } }
      ];
    }
    return where;
  }
}
