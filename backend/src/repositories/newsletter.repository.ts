import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class NewsletterRepository {
  findByEmail(email: string) {
    return prisma.newsletterSubscriber.findUnique({ where: { email: email.toLowerCase() } });
  }

  upsert(email: string, data: Omit<Prisma.NewsletterSubscriberCreateInput, "email">) {
    return prisma.newsletterSubscriber.upsert({
      where: { email: email.toLowerCase() },
      create: {
        email: email.toLowerCase(),
        ...data
      },
      update: {
        ...data,
        isActive: true,
        unsubscribedAt: null
      }
    });
  }

  findMany(args: Prisma.NewsletterSubscriberFindManyArgs) {
    return prisma.newsletterSubscriber.findMany(args);
  }

  count(where: Prisma.NewsletterSubscriberWhereInput) {
    return prisma.newsletterSubscriber.count({ where });
  }

  deactivate(id: string) {
    return prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        isActive: false,
        unsubscribedAt: new Date()
      }
    });
  }
}
