import { InquiryStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class InquiryRepository {
  create(data: Prisma.InquiryCreateInput) {
    return prisma.inquiry.create({ data });
  }

  findMany(args: Prisma.InquiryFindManyArgs) {
    return prisma.inquiry.findMany(args);
  }

  count(where: Prisma.InquiryWhereInput) {
    return prisma.inquiry.count({ where });
  }

  updateStatus(id: string, status: InquiryStatus) {
    return prisma.inquiry.update({ where: { id }, data: { status } });
  }

  delete(id: string) {
    return prisma.inquiry.delete({ where: { id } });
  }
}
