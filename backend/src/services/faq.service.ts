import { Prisma } from "@prisma/client";
import { z } from "zod";
import { FaqRepository } from "../repositories/content.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";
import { faqBodySchema, faqListSchema } from "../validators/content.validator";

type FaqListQuery = z.infer<typeof faqListSchema>["query"];
type FaqInput = z.infer<typeof faqBodySchema>;

export class FaqService {
  constructor(private readonly faqRepository = new FaqRepository()) {}

  async list(query: FaqListQuery, admin = false) {
    const where: Prisma.FaqWhereInput = {};
    if (!admin) where.isPublished = true;
    else if (query.published !== undefined) where.isPublished = query.published;
    if (query.category) where.category = { contains: query.category, mode: "insensitive" };

    const [items, total] = await Promise.all([
      this.faqRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      this.faqRepository.count(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async create(input: FaqInput) {
    return this.faqRepository.create(input);
  }

  async update(id: string, input: Partial<FaqInput>) {
    await this.ensureExists(id);
    return this.faqRepository.update(id, input);
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.faqRepository.delete(id);
    return null;
  }

  private async ensureExists(id: string) {
    const faq = await this.faqRepository.findById(id);
    if (!faq) {
      throw new AppError("FAQ was not found", 404);
    }
    return faq;
  }
}
