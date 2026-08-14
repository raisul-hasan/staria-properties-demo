import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class MediaRepository {
  create(data: Prisma.MediaAssetCreateInput) {
    return prisma.mediaAsset.create({ data });
  }
}
