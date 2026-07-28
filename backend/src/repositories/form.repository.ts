import { InquiryStatus, NewsletterStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

const contactInclude = {
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true
    }
  }
} satisfies Prisma.ContactMessageInclude;

export type ContactMessageWithAssignee = Prisma.ContactMessageGetPayload<{ include: typeof contactInclude }>;

export class FormRepository {
  createContact(data: Prisma.ContactMessageCreateInput) {
    return prisma.contactMessage.create({
      data,
      include: contactInclude
    });
  }

  countContacts(where: Prisma.ContactMessageWhereInput) {
    return prisma.contactMessage.count({ where });
  }

  findContacts(args: Prisma.ContactMessageFindManyArgs) {
    return prisma.contactMessage.findMany(args);
  }

  findContactById(id: string) {
    return prisma.contactMessage.findFirst({
      where: { id },
      include: contactInclude
    });
  }

  updateContact(id: string, data: Prisma.ContactMessageUpdateInput) {
    return prisma.contactMessage.update({
      where: { id },
      data,
      include: contactInclude
    });
  }

  upsertNewsletter(email: string, data: Prisma.NewsletterSubscriberCreateInput) {
    return prisma.newsletterSubscriber.upsert({
      where: { email },
      create: data,
      update: {
        fullName: data.fullName,
        status: data.status,
        source: data.source,
        consentAccepted: data.consentAccepted,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        recaptchaScore: data.recaptchaScore,
        recaptchaAction: data.recaptchaAction,
        spamScore: data.spamScore,
        spamReason: data.spamReason,
        subscribedAt: data.status === NewsletterStatus.SUBSCRIBED ? new Date() : undefined,
        unsubscribedAt: data.status === NewsletterStatus.SUBSCRIBED ? null : undefined,
        deletedAt: null
      }
    });
  }

  countNewsletter(where: Prisma.NewsletterSubscriberWhereInput) {
    return prisma.newsletterSubscriber.count({ where });
  }

  findNewsletter(args: Prisma.NewsletterSubscriberFindManyArgs) {
    return prisma.newsletterSubscriber.findMany(args);
  }

  findNewsletterById(id: string) {
    return prisma.newsletterSubscriber.findFirst({
      where: { id }
    });
  }

  updateNewsletter(id: string, data: Prisma.NewsletterSubscriberUpdateInput) {
    return prisma.newsletterSubscriber.update({
      where: { id },
      data
    });
  }

  findActiveAdmin(id: string) {
    return prisma.adminUser.findFirst({
      where: {
        id,
        status: "ACTIVE",
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
  }

  contactStatusCounts() {
    return prisma.contactMessage.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { status: true }
    });
  }

  newsletterStatusCounts() {
    return prisma.newsletterSubscriber.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { status: true }
    });
  }
}
