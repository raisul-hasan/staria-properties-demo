import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class SiteRepository {
  async getAllSettings() {
    return prisma.websiteSetting.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null
      }
    });
  }

  upsert(group: string, key: string, value: unknown) {
    return prisma.websiteSetting.upsert({
      where: { key },
      create: { group, key, value: value as Prisma.InputJsonValue },
      update: { value: value as Prisma.InputJsonValue }
    });
  }
}
