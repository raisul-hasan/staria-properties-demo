import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { uploadImage } from "../middleware/upload.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const adminUploadRouter = Router();

const controller = new UploadController();

adminUploadRouter.use(authenticate);
adminUploadRouter.post(
  "/image",
  requirePermissions("media:upload"),
  uploadImage.single("image"),
  asyncHandler(controller.uploadImage)
);
