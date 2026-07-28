import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class ServiceRepository {
  findMany(args: Prisma.ServiceFindManyArgs) {
    return prisma.service.findMany(args);
  }

  count(where: Prisma.ServiceWhereInput) {
    return prisma.service.count({ where });
  }

  findBySlug(slug: string, publishedOnly = true) {
    return prisma.service.findFirst({
      where: { slug, ...(publishedOnly ? { isPublished: true } : {}) }
    });
  }

  findById(id: string) {
    return prisma.service.findUnique({ where: { id } });
  }

  create(data: Prisma.ServiceCreateInput) {
    return prisma.service.create({ data });
  }

  update(id: string, data: Prisma.ServiceUpdateInput) {
    return prisma.service.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.service.delete({ where: { id } });
  }
}
