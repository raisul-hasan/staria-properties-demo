import { Router } from "express";
import { z } from "zod";
import { CmsController } from "../controllers/cms.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { requireCmsPermission } from "../middleware/cmsPermission.middleware";
import { uploadImage, uploadMedia } from "../middleware/upload.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  cmsBodySchema,
  cmsIdParamSchema,
  cmsListQuerySchema,
  cmsResourceParamSchema
} from "../config/cmsResources";

const router = Router();
const controller = new CmsController();

const cmsListSchema = cmsResourceParamSchema.extend({
  query: cmsListQuerySchema
});

const uploadBodySchema = z.object({
  body: z.object({
    altText: z.string().trim().max(255).optional()
  })
});

const mediaListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(24),
    search: z.string().trim().optional(),
    resourceType: z.enum(["IMAGE", "VIDEO", "PDF", "RAW"]).optional()
  })
});

router.use(authenticate);

router.get(
  "/media",
  requirePermissions("media:read"),
  validate(mediaListSchema),
  asyncHandler(controller.listMedia)
);
router.post(
  "/media/images",
  requirePermissions("media:upload"),
  uploadImage.single("image"),
  validate(uploadBodySchema),
  asyncHandler(controller.uploadImage)
);
router.post(
  "/media/files",
  requirePermissions("media:upload"),
  uploadMedia.single("file"),
  validate(uploadBodySchema),
  asyncHandler(controller.uploadFile)
);

router.get("/:resource", validate(cmsListSchema), requireCmsPermission("read"), asyncHandler(controller.list));
router.post(
  "/:resource",
  validate(cmsResourceParamSchema),
  requireCmsPermission("create"),
  validate(cmsBodySchema),
  asyncHandler(controller.create)
);
router.patch(
  "/:resource/:id/publish",
  validate(cmsIdParamSchema),
  requireCmsPermission("update"),
  asyncHandler(controller.publish)
);
router.patch(
  "/:resource/:id/draft",
  validate(cmsIdParamSchema),
  requireCmsPermission("update"),
  asyncHandler(controller.draft)
);
router.patch(
  "/:resource/:id/restore",
  validate(cmsIdParamSchema),
  requireCmsPermission("update"),
  asyncHandler(controller.restore)
);
router.get("/:resource/:id", validate(cmsIdParamSchema), requireCmsPermission("read"), asyncHandler(controller.get));
router.patch(
  "/:resource/:id",
  validate(cmsIdParamSchema),
  requireCmsPermission("update"),
  validate(cmsBodySchema),
  asyncHandler(controller.update)
);
router.delete(
  "/:resource/:id",
  validate(cmsIdParamSchema),
  requireCmsPermission("delete"),
  asyncHandler(controller.delete)
);

export default router;
