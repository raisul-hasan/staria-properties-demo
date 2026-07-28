import { Router } from "express";
import { FormController } from "../controllers/form.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { cachePolicies } from "../middleware/cache.middleware";
import { formLimiter } from "../middleware/rateLimiter.middleware";
import { mergeSchemas, validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  contactListSchema,
  contactSubmissionSchema,
  idParamSchema,
  newsletterListSchema,
  newsletterSubscriptionSchema,
  updateContactStatusSchema,
  updateNewsletterStatusSchema
} from "../validators/form.validator";

export const contactRouter = Router();
export const newsletterSubscriptionRouter = Router();
export const adminContactRouter = Router();
export const adminNewsletterRouter = Router();

const controller = new FormController();

contactRouter.post("/", formLimiter, validate(contactSubmissionSchema), asyncHandler(controller.submitContact));
newsletterSubscriptionRouter.post(
  "/subscribe",
  formLimiter,
  validate(newsletterSubscriptionSchema),
  asyncHandler(controller.subscribeNewsletter)
);

adminContactRouter.use(authenticate);
adminContactRouter.get(
  "/",
  requirePermissions("contact:read"),
  validate(contactListSchema),
  asyncHandler(controller.listContacts)
);
adminContactRouter.get("/stats", requirePermissions("contact:read"), asyncHandler(controller.contactStats));
adminContactRouter.get(
  "/:id",
  requirePermissions("contact:read"),
  validate(idParamSchema),
  asyncHandler(controller.getContact)
);
adminContactRouter.patch(
  "/:id",
  requirePermissions("contact:update"),
  validate(mergeSchemas(idParamSchema, updateContactStatusSchema)),
  asyncHandler(controller.updateContact)
);
adminContactRouter.delete(
  "/:id",
  requirePermissions("contact:delete"),
  validate(idParamSchema),
  asyncHandler(controller.deleteContact)
);

adminNewsletterRouter.use(authenticate);
adminNewsletterRouter.get(
  "/",
  requirePermissions("newsletter:read"),
  validate(newsletterListSchema),
  asyncHandler(controller.listNewsletter)
);
adminNewsletterRouter.get("/stats", requirePermissions("newsletter:read"), asyncHandler(controller.newsletterStats));
adminNewsletterRouter.get(
  "/:id",
  requirePermissions("newsletter:read"),
  validate(idParamSchema),
  asyncHandler(controller.getNewsletter)
);
adminNewsletterRouter.patch(
  "/:id",
  requirePermissions("newsletter:update"),
  validate(mergeSchemas(idParamSchema, updateNewsletterStatusSchema)),
  asyncHandler(controller.updateNewsletter)
);
adminNewsletterRouter.delete(
  "/:id",
  requirePermissions("newsletter:delete"),
  validate(idParamSchema),
  asyncHandler(controller.deleteNewsletter)
);
