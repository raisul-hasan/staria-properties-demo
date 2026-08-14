import { Prisma } from "@prisma/client";
import { z } from "zod";
import { TestimonialRepository } from "../repositories/content.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";
import { testimonialBodySchema, testimonialListSchema } from "../validators/content.validator";

type TestimonialListQuery = z.infer<typeof testimonialListSchema>["query"];
type TestimonialInput = z.infer<typeof testimonialBodySchema>;

export class TestimonialService {
  constructor(private readonly testimonialRepository = new TestimonialRepository()) {}

  async list(query: TestimonialListQuery, admin = false) {
    const where: Prisma.TestimonialWhereInput = {};
    if (!admin) where.isPublished = true;
    else if (query.published !== undefined) where.isPublished = query.published;
    if (query.featured !== undefined) where.isFeatured = query.featured;

    const [items, total] = await Promise.all([
      this.testimonialRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      this.testimonialRepository.count(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async create(input: TestimonialInput) {
    return this.testimonialRepository.create(input);
  }

  async update(id: string, input: Partial<TestimonialInput>) {
    await this.ensureExists(id);
    return this.testimonialRepository.update(id, input);
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.testimonialRepository.delete(id);
    return null;
  }

  private async ensureExists(id: string) {
    const testimonial = await this.testimonialRepository.findById(id);
    if (!testimonial) {
      throw new AppError("Testimonial was not found", 404);
    }
    return testimonial;
  }
}
