import { Router } from "express";
import { NewsletterController } from "../controllers/newsletter.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { idParamSchema } from "../validators/common.validator";
import { newsletterListSchema, subscribeSchema } from "../validators/newsletter.validator";

export const newsletterRouter = Router();
export const adminNewsletterRouter = Router();

const controller = new NewsletterController();

newsletterRouter.post("/subscribe", validate(subscribeSchema), asyncHandler(controller.subscribe));

adminNewsletterRouter.use(authenticate);
adminNewsletterRouter.get(
  "/subscribers",
  requirePermissions("newsletter:read"),
  validate(newsletterListSchema),
  asyncHandler(controller.list)
);
adminNewsletterRouter.delete(
  "/subscribers/:id",
  requirePermissions("newsletter:delete"),
  validate(idParamSchema),
  asyncHandler(controller.deactivate)
);
