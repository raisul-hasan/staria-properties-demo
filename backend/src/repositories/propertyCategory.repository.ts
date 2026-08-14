import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class PropertyCategoryRepository {
  findMany(args: Prisma.PropertyCategoryFindManyArgs = {}) {
    return prisma.propertyCategory.findMany(args);
  }

  count(where: Prisma.PropertyCategoryWhereInput) {
    return prisma.propertyCategory.count({ where });
  }

  findBySlug(slug: string) {
    return prisma.propertyCategory.findUnique({ where: { slug } });
  }

  findById(id: string) {
    return prisma.propertyCategory.findUnique({ where: { id } });
  }

  create(data: Prisma.PropertyCategoryCreateInput) {
    return prisma.propertyCategory.create({ data });
  }

  update(id: string, data: Prisma.PropertyCategoryUpdateInput) {
    return prisma.propertyCategory.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.propertyCategory.delete({ where: { id } });
  }
}
