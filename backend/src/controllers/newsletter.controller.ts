import { Request, Response } from "express";
import { NewsletterService } from "../services/newsletter.service";
import { sendSuccess } from "../utils/apiResponse";
import { getRouteParam } from "../utils/request";

export class NewsletterController {
  constructor(private readonly newsletterService = new NewsletterService()) {}

  subscribe = async (req: Request, res: Response) => {
    const data = await this.newsletterService.subscribe(req.body);
    return sendSuccess(res, 201, "Subscribed successfully", data);
  };

  list = async (req: Request, res: Response) => {
    const data = await this.newsletterService.list(req.query as never);
    return sendSuccess(res, 200, "Newsletter subscribers retrieved successfully", data);
  };

  deactivate = async (req: Request, res: Response) => {
    await this.newsletterService.deactivate(getRouteParam(req, "id"));
    return sendSuccess(res, 200, "Newsletter subscriber deactivated successfully");
  };
}
