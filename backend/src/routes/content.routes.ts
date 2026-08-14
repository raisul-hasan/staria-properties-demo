import { Router } from "express";
import { FaqController, InteriorPortfolioController, TestimonialController } from "../controllers/content.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { idParamSchema } from "../validators/common.validator";
import {
  createFaqSchema,
  createInteriorPortfolioSchema,
  createTestimonialSchema,
  faqListSchema,
  interiorPortfolioListSchema,
  testimonialListSchema,
  updateFaqSchema,
  updateInteriorPortfolioSchema,
  updateTestimonialSchema
} from "../validators/content.validator";

export const faqRouter = Router();
export const testimonialRouter = Router();
export const interiorPortfolioRouter = Router();
export const adminFaqRouter = Router();
export const adminTestimonialRouter = Router();
export const adminInteriorPortfolioRouter = Router();

const faqController = new FaqController();
const testimonialController = new TestimonialController();
const interiorPortfolioController = new InteriorPortfolioController();

faqRouter.get("/", validate(faqListSchema), asyncHandler(faqController.list));
testimonialRouter.get("/", validate(testimonialListSchema), asyncHandler(testimonialController.list));
interiorPortfolioRouter.get("/", validate(interiorPortfolioListSchema), asyncHandler(interiorPortfolioController.list));

adminFaqRouter.use(authenticate);
adminFaqRouter.get("/", requirePermissions("content:read"), validate(faqListSchema), asyncHandler(faqController.adminList));
adminFaqRouter.post("/", requirePermissions("content:create"), validate(createFaqSchema), asyncHandler(faqController.create));
adminFaqRouter.patch(
  "/:id",
  requirePermissions("content:update"),
  validate(idParamSchema),
  validate(updateFaqSchema),
  asyncHandler(faqController.update)
);
adminFaqRouter.delete("/:id", requirePermissions("content:delete"), validate(idParamSchema), asyncHandler(faqController.delete));

adminTestimonialRouter.use(authenticate);
adminTestimonialRouter.get(
  "/",
  requirePermissions("testimonials:read"),
  validate(testimonialListSchema),
  asyncHandler(testimonialController.adminList)
);
adminTestimonialRouter.post(
  "/",
  requirePermissions("testimonials:create"),
  validate(createTestimonialSchema),
  asyncHandler(testimonialController.create)
);
adminTestimonialRouter.patch(
  "/:id",
  requirePermissions("testimonials:update"),
  validate(idParamSchema),
  validate(updateTestimonialSchema),
  asyncHandler(testimonialController.update)
);
adminTestimonialRouter.delete(
  "/:id",
  requirePermissions("testimonials:delete"),
  validate(idParamSchema),
  asyncHandler(testimonialController.delete)
);

adminInteriorPortfolioRouter.use(authenticate);
adminInteriorPortfolioRouter.get(
  "/",
  requirePermissions("gallery:read"),
  validate(interiorPortfolioListSchema),
  asyncHandler(interiorPortfolioController.adminList)
);
adminInteriorPortfolioRouter.post(
  "/",
  requirePermissions("gallery:create"),
  validate(createInteriorPortfolioSchema),
  asyncHandler(interiorPortfolioController.create)
);
adminInteriorPortfolioRouter.patch(
  "/:id",
  requirePermissions("gallery:update"),
  validate(idParamSchema),
  validate(updateInteriorPortfolioSchema),
  asyncHandler(interiorPortfolioController.update)
);
adminInteriorPortfolioRouter.delete(
  "/:id",
  requirePermissions("gallery:delete"),
  validate(idParamSchema),
  asyncHandler(interiorPortfolioController.delete)
);
