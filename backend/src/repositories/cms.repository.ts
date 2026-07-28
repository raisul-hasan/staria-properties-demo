import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type PrismaDelegate = {
  count(args: unknown): Promise<number>;
  findMany(args: unknown): Promise<unknown[]>;
  findFirst(args: unknown): Promise<unknown | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
};

export class CmsRepository {
  private delegate(model: string) {
    const client = prisma as unknown as Record<string, PrismaDelegate>;
    const delegate = client[model];

    if (!delegate) {
      throw new Error(`Unsupported Prisma model delegate: ${model}`);
    }

    return delegate;
  }

  count(model: string, where: Record<string, unknown>) {
    return this.delegate(model).count({ where });
  }

  findMany(model: string, args: Record<string, unknown>) {
    return this.delegate(model).findMany(args);
  }

  findById(model: string, id: string, include?: Record<string, unknown>) {
    return this.delegate(model).findFirst({
      where: { id },
      include
    });
  }

  findOne(model: string, where: Record<string, unknown>, include?: Record<string, unknown>) {
    return this.delegate(model).findFirst({
      where,
      include
    });
  }

  create(model: string, data: Record<string, unknown>, include?: Record<string, unknown>) {
    return this.delegate(model).create({
      data,
      include
    });
  }

  update(model: string, id: string, data: Record<string, unknown>, include?: Record<string, unknown>) {
    return this.delegate(model).update({
      where: { id },
      data,
      include
    });
  }

  transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
    return prisma.$transaction(callback);
  }

  async upsertBlogTags(tagNames: string[]) {
    return Promise.all(
      tagNames.map((name) => {
        const slug = name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        return prisma.blogTag.upsert({
          where: { slug },
          update: { name },
          create: { name, slug }
        });
      })
    );
  }
}
