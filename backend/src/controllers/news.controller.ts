import { Request, Response } from "express";
import { NewsService } from "../services/news.service";
import { sendSuccess } from "../utils/apiResponse";
import { getRouteParam } from "../utils/request";

export class NewsController {
  constructor(private readonly newsService = new NewsService()) {}

  list = async (req: Request, res: Response) => {
    const data = await this.newsService.list(req.query as never);
    return sendSuccess(res, 200, "Articles retrieved successfully", data);
  };

  adminList = async (req: Request, res: Response) => {
    const data = await this.newsService.list(req.query as never, true);
    return sendSuccess(res, 200, "Articles retrieved successfully", data);
  };

  getBySlug = async (req: Request, res: Response) => {
    const data = await this.newsService.getBySlug(getRouteParam(req, "slug"));
    return sendSuccess(res, 200, "Article retrieved successfully", data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.newsService.create(req.body);
    return sendSuccess(res, 201, "Article created successfully", data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.newsService.update(getRouteParam(req, "id"), req.body);
    return sendSuccess(res, 200, "Article updated successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    await this.newsService.delete(getRouteParam(req, "id"));
    return sendSuccess(res, 200, "Article deleted successfully");
  };
}
