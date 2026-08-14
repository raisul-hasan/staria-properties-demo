import { Router } from "express";
import { PropertyCategoryController, PropertyController } from "../controllers/property.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { idParamSchema, listQuerySchema, slugParamSchema } from "../validators/common.validator";
import {
  createPropertyCategorySchema,
  createPropertySchema,
  propertyListSchema,
  updatePropertyCategorySchema,
  updatePropertySchema
} from "../validators/property.validator";

export const propertyRouter = Router();
export const propertyCategoryRouter = Router();
export const adminPropertyRouter = Router();
export const adminPropertyCategoryRouter = Router();

const propertyController = new PropertyController();
const categoryController = new PropertyCategoryController();

propertyRouter.get("/", validate(propertyListSchema), asyncHandler(propertyController.list));
propertyRouter.get("/:slug", validate(slugParamSchema), asyncHandler(propertyController.getBySlug));

propertyCategoryRouter.get("/", asyncHandler(categoryController.list));

adminPropertyRouter.use(authenticate);
adminPropertyRouter.get("/", requirePermissions("products:read"), validate(propertyListSchema), asyncHandler(propertyController.adminList));
adminPropertyRouter.post("/", requirePermissions("products:create"), validate(createPropertySchema), asyncHandler(propertyController.create));
adminPropertyRouter.patch(
  "/:id",
  requirePermissions("products:update"),
  validate(idParamSchema),
  validate(updatePropertySchema),
  asyncHandler(propertyController.update)
);
adminPropertyRouter.delete(
  "/:id",
  requirePermissions("products:delete"),
  validate(idParamSchema),
  asyncHandler(propertyController.delete)
);

adminPropertyCategoryRouter.use(authenticate);
adminPropertyCategoryRouter.get(
  "/",
  requirePermissions("categories:read"),
  validate(listQuerySchema),
  asyncHandler(categoryController.adminList)
);
adminPropertyCategoryRouter.post(
  "/",
  requirePermissions("categories:create"),
  validate(createPropertyCategorySchema),
  asyncHandler(categoryController.create)
);
adminPropertyCategoryRouter.patch(
  "/:id",
  requirePermissions("categories:update"),
  validate(idParamSchema),
  validate(updatePropertyCategorySchema),
  asyncHandler(categoryController.update)
);
adminPropertyCategoryRouter.delete(
  "/:id",
  requirePermissions("categories:delete"),
  validate(idParamSchema),
  asyncHandler(categoryController.delete)
);
