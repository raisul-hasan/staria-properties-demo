import { Router } from "express";
import { PublicContentController } from "../controllers/public.controller";
import { cachePolicies } from "../middleware/cache.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const controller = new PublicContentController();

// Apply public short-cache policy for fast CDN & browser response
router.use(cachePolicies.publicShort);

router.get("/properties", asyncHandler(controller.getProperties));
router.get("/properties/:id", asyncHandler(controller.getPropertyById));

router.get("/projects", asyncHandler(controller.getProjects));
router.get("/projects/:id", asyncHandler(controller.getProjectById));

router.get("/news", asyncHandler(controller.getNews));
router.get("/news/:id", asyncHandler(controller.getNewsById));

router.get("/faqs", asyncHandler(controller.getFaqs));
router.get("/services", asyncHandler(controller.getServices));
router.get("/testimonials", asyncHandler(controller.getTestimonials));
router.get("/gallery", asyncHandler(controller.getGallery));
router.get("/hero-slides", asyncHandler(controller.getHeroSlides));
router.get("/stats", asyncHandler(controller.getCompanyStats));

export default router;
