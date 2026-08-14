import { Router } from "express";
import { NewsController } from "../controllers/news.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { idParamSchema, slugParamSchema } from "../validators/common.validator";
import { createNewsSchema, newsListSchema, updateNewsSchema } from "../validators/content.validator";

export const newsRouter = Router();
export const adminNewsRouter = Router();

const controller = new NewsController();

newsRouter.get("/", validate(newsListSchema), asyncHandler(controller.list));
newsRouter.get("/:slug", validate(slugParamSchema), asyncHandler(controller.getBySlug));

adminNewsRouter.use(authenticate);
adminNewsRouter.get("/", requirePermissions("blog:read"), validate(newsListSchema), asyncHandler(controller.adminList));
adminNewsRouter.post("/", requirePermissions("blog:create"), validate(createNewsSchema), asyncHandler(controller.create));
adminNewsRouter.patch(
  "/:id",
  requirePermissions("blog:update"),
  validate(idParamSchema),
  validate(updateNewsSchema),
  asyncHandler(controller.update)
);
adminNewsRouter.delete("/:id", requirePermissions("blog:delete"), validate(idParamSchema), asyncHandler(controller.delete));
