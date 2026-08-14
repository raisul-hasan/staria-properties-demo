import { Prisma } from "@prisma/client";
import { z } from "zod";
import { sendMail } from "../config/mail";
import { NewsletterRepository } from "../repositories/newsletter.repository";
import { buildPaginationMeta } from "../utils/pagination";
import { newsletterListSchema, subscribeSchema } from "../validators/newsletter.validator";

type SubscribeInput = z.infer<typeof subscribeSchema>["body"];
type NewsletterListQuery = z.infer<typeof newsletterListSchema>["query"];

export class NewsletterService {
  constructor(private readonly newsletterRepository = new NewsletterRepository()) {}

  async subscribe(input: SubscribeInput) {
    const subscriber = await this.newsletterRepository.upsert(input.email, {
      name: input.name,
      source: input.source ?? "website"
    });

    await sendMail({
      to: subscriber.email,
      subject: "You are subscribed to Staria Properties insights",
      text: "Thank you for subscribing to Staria Properties insights.",
      html: "<p>Thank you for subscribing to Staria Properties insights.</p>"
    });

    return subscriber;
  }

  async list(query: NewsletterListQuery) {
    const where: Prisma.NewsletterSubscriberWhereInput = {};
    if (query.active !== undefined) where.isActive = query.active;
    if (query.q) {
      where.OR = [
        { email: { contains: query.q, mode: "insensitive" } },
        { name: { contains: query.q, mode: "insensitive" } }
      ];
    }

    const [items, total] = await Promise.all([
      this.newsletterRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { subscribedAt: "desc" }
      }),
      this.newsletterRepository.count(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async deactivate(id: string) {
    await this.newsletterRepository.deactivate(id);
    return null;
  }
}
