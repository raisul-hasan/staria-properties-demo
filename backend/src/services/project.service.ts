import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ProjectRepository } from "../repositories/project.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";
import { createSlug } from "../utils/slug";
import { projectBodySchema, projectListSchema } from "../validators/project.validator";

type ProjectListQuery = z.infer<typeof projectListSchema>["query"];
type ProjectInput = z.infer<typeof projectBodySchema>;

export class ProjectService {
  constructor(private readonly projectRepository = new ProjectRepository()) {}

  async list(query: ProjectListQuery, admin = false) {
    const where = this.buildWhere(query, admin);
    const [items, total] = await Promise.all([
      this.projectRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      this.projectRepository.count(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async getBySlug(slug: string, admin = false) {
    const item = await this.projectRepository.findBySlug(slug, !admin);
    if (!item) {
      throw new AppError("Project was not found", 404);
    }
    return item;
  }

  async create(input: ProjectInput) {
    return this.projectRepository.create({
      ...input,
      slug: input.slug ? createSlug(input.slug) : createSlug(input.name)
    });
  }

  async update(id: string, input: Partial<ProjectInput>) {
    await this.ensureExists(id);
    return this.projectRepository.update(id, {
      ...input,
      slug: input.slug ? createSlug(input.slug) : undefined
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.projectRepository.delete(id);
    return null;
  }

  private async ensureExists(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new AppError("Project was not found", 404);
    }
    return project;
  }

  private buildWhere(query: ProjectListQuery, admin: boolean): Prisma.ProjectWhereInput {
    const where: Prisma.ProjectWhereInput = {};
    if (!admin) where.isPublished = true;
    else if (query.published !== undefined) where.isPublished = query.published;
    if (query.featured !== undefined) where.isFeatured = query.featured;
    if (query.category) where.category = { contains: query.category, mode: "insensitive" };
    if (query.status) where.status = query.status;
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { location: { contains: query.q, mode: "insensitive" } },
        { type: { contains: query.q, mode: "insensitive" } },
        { category: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } }
      ];
    }
    return where;
  }
}
