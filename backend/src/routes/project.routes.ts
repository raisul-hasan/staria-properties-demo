import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { idParamSchema, slugParamSchema } from "../validators/common.validator";
import { createProjectSchema, projectListSchema, updateProjectSchema } from "../validators/project.validator";

export const projectRouter = Router();
export const adminProjectRouter = Router();

const controller = new ProjectController();

projectRouter.get("/", validate(projectListSchema), asyncHandler(controller.list));
projectRouter.get("/:slug", validate(slugParamSchema), asyncHandler(controller.getBySlug));

adminProjectRouter.use(authenticate);
adminProjectRouter.get("/", requirePermissions("content:read"), validate(projectListSchema), asyncHandler(controller.adminList));
adminProjectRouter.post("/", requirePermissions("content:create"), validate(createProjectSchema), asyncHandler(controller.create));
adminProjectRouter.patch(
  "/:id",
  requirePermissions("content:update"),
  validate(idParamSchema),
  validate(updateProjectSchema),
  asyncHandler(controller.update)
);
adminProjectRouter.delete(
  "/:id",
  requirePermissions("content:delete"),
  validate(idParamSchema),
  asyncHandler(controller.delete)
);
