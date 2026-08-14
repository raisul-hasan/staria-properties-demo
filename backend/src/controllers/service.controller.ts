import { Request, Response } from "express";
import { ServiceService } from "../services/service.service";
import { sendSuccess } from "../utils/apiResponse";
import { getRouteParam } from "../utils/request";

export class ServiceController {
  constructor(private readonly serviceService = new ServiceService()) {}

  list = async (req: Request, res: Response) => {
    const data = await this.serviceService.list(req.query as never);
    return sendSuccess(res, 200, "Services retrieved successfully", data);
  };

  adminList = async (req: Request, res: Response) => {
    const data = await this.serviceService.list(req.query as never, true);
    return sendSuccess(res, 200, "Services retrieved successfully", data);
  };

  getBySlug = async (req: Request, res: Response) => {
    const data = await this.serviceService.getBySlug(getRouteParam(req, "slug"));
    return sendSuccess(res, 200, "Service retrieved successfully", data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.serviceService.create(req.body);
    return sendSuccess(res, 201, "Service created successfully", data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.serviceService.update(getRouteParam(req, "id"), req.body);
    return sendSuccess(res, 200, "Service updated successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    await this.serviceService.delete(getRouteParam(req, "id"));
    return sendSuccess(res, 200, "Service deleted successfully");
  };
}
