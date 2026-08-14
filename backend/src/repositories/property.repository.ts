import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class PropertyRepository {
  findMany(args: Prisma.PropertyFindManyArgs) {
    return prisma.property.findMany({
      ...args,
      include: { category: true, ...(args.include as object) }
    });
  }

  count(where: Prisma.PropertyWhereInput) {
    return prisma.property.count({ where });
  }

  findBySlug(slug: string, publishedOnly = true) {
    return prisma.property.findFirst({
      where: { slug, ...(publishedOnly ? { isPublished: true } : {}) },
      include: { category: true }
    });
  }

  findById(id: string) {
    return prisma.property.findUnique({ where: { id }, include: { category: true } });
  }

  create(data: Prisma.PropertyUncheckedCreateInput) {
    return prisma.property.create({ data, include: { category: true } });
  }

  update(id: string, data: Prisma.PropertyUncheckedUpdateInput) {
    return prisma.property.update({ where: { id }, data, include: { category: true } });
  }

  delete(id: string) {
    return prisma.property.delete({ where: { id } });
  }
}
