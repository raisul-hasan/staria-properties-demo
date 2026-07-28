import { MediaResourceType } from "@prisma/client";
import { uploadFileBuffer, uploadImageBuffer } from "../config/cloudinary";
import { MediaRepository } from "../repositories/media.repository";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta } from "../utils/pagination";

export class UploadService {
  constructor(private readonly mediaRepository = new MediaRepository()) {}

  async uploadImage(file: Express.Multer.File | undefined, userId?: string, altText?: string) {
    if (!file) {
      throw new AppError("Image file is required", 400);
    }

    const result = await uploadImageBuffer(file);

    return this.mediaRepository.create({
      cloudinaryPublicId: result.public_id,
      secureUrl: result.secure_url,
      resourceType: MediaResourceType.IMAGE,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      folder: result.folder,
      altText,
      uploadedBy: userId ? { connect: { id: userId } } : undefined
    });
  }

  async uploadFile(file: Express.Multer.File | undefined, userId?: string, altText?: string) {
    if (!file) {
      throw new AppError("File is required", 400);
    }

    const result = await uploadFileBuffer(file);

    return this.mediaRepository.create({
      cloudinaryPublicId: result.public_id,
      secureUrl: result.secure_url,
      resourceType: this.mapResourceType(result.resource_type),
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      folder: result.folder,
      altText,
      uploadedBy: userId ? { connect: { id: userId } } : undefined
    });
  }

  async list(query: { page: number; limit: number; search?: string; resourceType?: string }) {
    const [items, total] = await this.mediaRepository.list({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      search: query.search,
      resourceType: query.resourceType
    });
    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit)
    };
  }

  private mapResourceType(resourceType: string) {
    if (resourceType === "image") return MediaResourceType.IMAGE;
    if (resourceType === "video") return MediaResourceType.VIDEO;
    if (resourceType === "raw") return MediaResourceType.RAW;
    return MediaResourceType.RAW;
  }
}
