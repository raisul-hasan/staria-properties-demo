import { InquiryStatus, Prisma } from "@prisma/client";
import { z } from "zod";
import { env } from "../config/env";
import { sendMail } from "../config/mail";
import { InquiryRepository } from "../repositories/inquiry.repository";
import { buildPaginationMeta } from "../utils/pagination";
import { inquiryListSchema, inquirySchema } from "../validators/inquiry.validator";

type InquiryInput = z.infer<typeof inquirySchema>["body"];
type InquiryListQuery = z.infer<typeof inquiryListSchema>["query"];

export class InquiryService {
  constructor(private readonly inquiryRepository = new InquiryRepository()) {}

  async create(input: InquiryInput) {
    const inquiry = await this.inquiryRepository.create({
      ...input,
      email: input.email.toLowerCase(),
      metadata: input.metadata as Prisma.InputJsonValue | undefined
    });

    await this.notifyTeam(inquiry);
    await this.sendConfirmation(inquiry);

    return inquiry;
  }

  async list(query: InquiryListQuery) {
    const where: Prisma.InquiryWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { email: { contains: query.q, mode: "insensitive" } },
        { phone: { contains: query.q, mode: "insensitive" } },
        { message: { contains: query.q, mode: "insensitive" } }
      ];
    }

    const [items, total] = await Promise.all([
      this.inquiryRepository.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: "desc" }
      }),
      this.inquiryRepository.count(where)
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async updateStatus(id: string, status: InquiryStatus) {
    return this.inquiryRepository.updateStatus(id, status);
  }

  async delete(id: string) {
    await this.inquiryRepository.delete(id);
    return null;
  }

  private async notifyTeam(inquiry: { name: string; email: string; phone: string | null; message: string; serviceInterest: string | null }) {
    await sendMail({
      to: env.adminEmails,
      subject: `New Staria inquiry from ${inquiry.name}`,
      text: `${inquiry.name} (${inquiry.email}) sent an inquiry: ${inquiry.message}`,
      html: `
        <h2>New inquiry received</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone ?? "Not provided"}</p>
        <p><strong>Interest:</strong> ${inquiry.serviceInterest ?? "General"}</p>
        <p>${inquiry.message}</p>
      `
    });
  }

  private async sendConfirmation(inquiry: { name: string; email: string }) {
    await sendMail({
      to: inquiry.email,
      subject: "We received your Staria Properties inquiry",
      text: `Hello ${inquiry.name}, our team received your message and will contact you shortly.`,
      html: `
        <p>Hello ${inquiry.name},</p>
        <p>Thank you for contacting Staria Properties. Our team received your message and will contact you shortly.</p>
        <p>Regards,<br/>Staria Properties</p>
      `
    });
  }
}
