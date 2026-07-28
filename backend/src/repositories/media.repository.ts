import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class MediaRepository {
  create(data: Prisma.MediaAssetCreateInput) {
    return prisma.mediaAsset.create({ data });
  }

  list(options: { skip: number; take: number; search?: string; resourceType?: string }) {
    const where: Prisma.MediaAssetWhereInput = {
      deletedAt: null,
      ...(options.resourceType ? { resourceType: options.resourceType as never } : {}),
      ...(options.search
        ? {
            OR: [
              { altText: { contains: options.search, mode: "insensitive" } },
              { caption: { contains: options.search, mode: "insensitive" } },
              { cloudinaryPublicId: { contains: options.search, mode: "insensitive" } },
              { folder: { contains: options.search, mode: "insensitive" } }
            ]
          }
        : {})
    };
    return Promise.all([
      prisma.mediaAsset.findMany({
        where,
        skip: options.skip,
        take: options.take,
        orderBy: { createdAt: "desc" }
      }),
      prisma.mediaAsset.count({ where })
    ]);
  }
}
