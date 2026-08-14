import { Router } from "express";
import { InquiryController } from "../controllers/inquiry.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { idParamSchema } from "../validators/common.validator";
import { inquiryListSchema, inquirySchema, updateInquiryStatusSchema } from "../validators/inquiry.validator";

export const inquiryRouter = Router();
export const adminInquiryRouter = Router();

const controller = new InquiryController();

inquiryRouter.post("/", validate(inquirySchema), asyncHandler(controller.create));

adminInquiryRouter.use(authenticate);
adminInquiryRouter.get("/", requirePermissions("inquiries:read"), validate(inquiryListSchema), asyncHandler(controller.list));
adminInquiryRouter.patch(
  "/:id/status",
  requirePermissions("inquiries:update"),
  validate(idParamSchema),
  validate(updateInquiryStatusSchema),
  asyncHandler(controller.updateStatus)
);
adminInquiryRouter.delete(
  "/:id",
  requirePermissions("inquiries:delete"),
  validate(idParamSchema),
  asyncHandler(controller.delete)
);
