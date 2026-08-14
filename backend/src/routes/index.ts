import { Router } from "express";
import authRouter from "./auth.routes";
import cmsRouter from "./cms.routes";
import {
  adminContactRouter,
  adminNewsletterRouter,
  contactRouter,
  newsletterSubscriptionRouter
} from "./form.routes";
import { adminQuotationRouter, quotationRouter } from "./quotation.routes";
import { siteRouter } from "./site.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/site", siteRouter);
router.use("/contact", contactRouter);
router.use("/newsletter", newsletterSubscriptionRouter);
router.use("/quotations", quotationRouter);
router.use("/admin/cms", cmsRouter);
router.use("/admin/contact-submissions", adminContactRouter);
router.use("/admin/newsletter-subscribers", adminNewsletterRouter);
router.use("/admin/quotations", adminQuotationRouter);

export default router;
