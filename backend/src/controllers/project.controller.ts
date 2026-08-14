import { Request, Response } from "express";
import { ProjectService } from "../services/project.service";
import { sendSuccess } from "../utils/apiResponse";
import { getRouteParam } from "../utils/request";

export class ProjectController {
  constructor(private readonly projectService = new ProjectService()) {}

  list = async (req: Request, res: Response) => {
    const data = await this.projectService.list(req.query as never);
    return sendSuccess(res, 200, "Projects retrieved successfully", data);
  };

  adminList = async (req: Request, res: Response) => {
    const data = await this.projectService.list(req.query as never, true);
    return sendSuccess(res, 200, "Projects retrieved successfully", data);
  };

  getBySlug = async (req: Request, res: Response) => {
    const data = await this.projectService.getBySlug(getRouteParam(req, "slug"));
    return sendSuccess(res, 200, "Project retrieved successfully", data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.projectService.create(req.body);
    return sendSuccess(res, 201, "Project created successfully", data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.projectService.update(getRouteParam(req, "id"), req.body);
    return sendSuccess(res, 200, "Project updated successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    await this.projectService.delete(getRouteParam(req, "id"));
    return sendSuccess(res, 200, "Project deleted successfully");
  };
}
