import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { idParamSchema, slugParamSchema } from "../validators/common.validator";
import { createServiceSchema, serviceListSchema, updateServiceSchema } from "../validators/service.validator";

export const serviceRouter = Router();
export const adminServiceRouter = Router();

const controller = new ServiceController();

serviceRouter.get("/", validate(serviceListSchema), asyncHandler(controller.list));
serviceRouter.get("/:slug", validate(slugParamSchema), asyncHandler(controller.getBySlug));

adminServiceRouter.use(authenticate);
adminServiceRouter.get("/", requirePermissions("services:read"), validate(serviceListSchema), asyncHandler(controller.adminList));
adminServiceRouter.post("/", requirePermissions("services:create"), validate(createServiceSchema), asyncHandler(controller.create));
adminServiceRouter.patch(
  "/:id",
  requirePermissions("services:update"),
  validate(idParamSchema),
  validate(updateServiceSchema),
  asyncHandler(controller.update)
);
adminServiceRouter.delete(
  "/:id",
  requirePermissions("services:delete"),
  validate(idParamSchema),
  asyncHandler(controller.delete)
);
