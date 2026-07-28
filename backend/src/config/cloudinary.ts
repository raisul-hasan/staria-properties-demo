import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { env } from "./env";
import { AppError } from "../utils/AppError";

const isConfigured =
  Boolean(env.CLOUDINARY_CLOUD_NAME) && Boolean(env.CLOUDINARY_API_KEY) && Boolean(env.CLOUDINARY_API_SECRET);

if (isConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export async function uploadImageBuffer(file: Express.Multer.File): Promise<UploadApiResponse> {
  if (!isConfigured) {
    throw new AppError("Cloudinary is not configured", 503);
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  return cloudinary.uploader.upload(dataUri, {
    folder: env.CLOUDINARY_FOLDER,
    resource_type: "image",
    use_filename: true,
    unique_filename: true
  });
}

export async function uploadFileBuffer(file: Express.Multer.File): Promise<UploadApiResponse> {
  if (!isConfigured) {
    throw new AppError("Cloudinary is not configured", 503);
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  return cloudinary.uploader.upload(dataUri, {
    folder: env.CLOUDINARY_FOLDER,
    resource_type: "auto",
    use_filename: true,
    unique_filename: true
  });
}
