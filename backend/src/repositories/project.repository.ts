import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class ProjectRepository {
  findMany(args: Prisma.ProjectFindManyArgs) {
    return prisma.project.findMany(args);
  }

  count(where: Prisma.ProjectWhereInput) {
    return prisma.project.count({ where });
  }

  findBySlug(slug: string, publishedOnly = true) {
    return prisma.project.findFirst({
      where: { slug, ...(publishedOnly ? { isPublished: true } : {}) }
    });
  }

  findById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  }

  create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data });
  }

  update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }
}
