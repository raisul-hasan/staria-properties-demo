import { Router } from "express";
import { HealthController, SiteController } from "../controllers/site.controller";
import { asyncHandler } from "../utils/asyncHandler";

export const siteRouter = Router();
export const healthRouter = Router();

const siteController = new SiteController();
const healthController = new HealthController();

siteRouter.get("/", asyncHandler(siteController.getSite));
healthRouter.get("/", asyncHandler(healthController.check));
