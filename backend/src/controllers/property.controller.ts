import { Request, Response } from "express";
import { PropertyCategoryService, PropertyService } from "../services/property.service";
import { sendSuccess } from "../utils/apiResponse";
import { getRouteParam } from "../utils/request";

export class PropertyController {
  constructor(private readonly propertyService = new PropertyService()) {}

  list = async (req: Request, res: Response) => {
    const data = await this.propertyService.list(req.query as never);
    return sendSuccess(res, 200, "Properties retrieved successfully", data);
  };

  adminList = async (req: Request, res: Response) => {
    const data = await this.propertyService.list(req.query as never, true);
    return sendSuccess(res, 200, "Properties retrieved successfully", data);
  };

  getBySlug = async (req: Request, res: Response) => {
    const data = await this.propertyService.getBySlug(getRouteParam(req, "slug"));
    return sendSuccess(res, 200, "Property retrieved successfully", data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.propertyService.create(req.body);
    return sendSuccess(res, 201, "Property created successfully", data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.propertyService.update(getRouteParam(req, "id"), req.body);
    return sendSuccess(res, 200, "Property updated successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    await this.propertyService.delete(getRouteParam(req, "id"));
    return sendSuccess(res, 200, "Property deleted successfully");
  };
}

export class PropertyCategoryController {
  constructor(private readonly categoryService = new PropertyCategoryService()) {}

  list = async (_req: Request, res: Response) => {
    const data = await this.categoryService.list();
    return sendSuccess(res, 200, "Property categories retrieved successfully", data);
  };

  adminList = async (req: Request, res: Response) => {
    const data = await this.categoryService.adminList(req.query as never);
    return sendSuccess(res, 200, "Property categories retrieved successfully", data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.categoryService.create(req.body);
    return sendSuccess(res, 201, "Property category created successfully", data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.categoryService.update(getRouteParam(req, "id"), req.body);
    return sendSuccess(res, 200, "Property category updated successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    await this.categoryService.delete(getRouteParam(req, "id"));
    return sendSuccess(res, 200, "Property category deleted successfully");
  };
}
