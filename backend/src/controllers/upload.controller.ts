import { Request, Response } from "express";
import { UploadService } from "../services/upload.service";
import { sendSuccess } from "../utils/apiResponse";

export class UploadController {
  constructor(private readonly uploadService = new UploadService()) {}

  uploadImage = async (req: Request, res: Response) => {
    const data = await this.uploadService.uploadImage(req.file, req.user?.id, req.body.altText);
    return sendSuccess(res, 201, "Image uploaded successfully", data);
  };

  uploadFile = async (req: Request, res: Response) => {
    const data = await this.uploadService.uploadFile(req.file, req.user?.id, req.body.altText);
    return sendSuccess(res, 201, "File uploaded successfully", data);
  };
}
