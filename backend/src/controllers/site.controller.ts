import { Request, Response } from "express";
import { HealthService } from "../services/health.service";
import { SiteService } from "../services/site.service";
import { sendSuccess } from "../utils/apiResponse";
import { env } from "../config/env";

export class SiteController {
  constructor(private readonly siteService = new SiteService()) {}

  getSite = async (_req: Request, res: Response) => {
    const data = await this.siteService.getSite();
    return sendSuccess(res, 200, "Site metadata retrieved successfully", data);
  };
}

export class HealthController {
  constructor(private readonly healthService = new HealthService()) {}

  check = async (_req: Request, res: Response) => {
    const data = await this.healthService.check();
    if (data.status !== "ok") {
      return res.status(503).json({
        success: false,
        message: "Service is degraded - database unavailable",
        data,
        meta: {
          requestId: res.getHeader("x-request-id"),
          timestamp: new Date().toISOString(),
          version: env.API_PREFIX.replace(/^\//, "")
        }
      });
    }
    return sendSuccess(res, 200, "Service is healthy", data);
  };
}
