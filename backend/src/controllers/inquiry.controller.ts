import { Request, Response } from "express";
import { InquiryService } from "../services/inquiry.service";
import { sendSuccess } from "../utils/apiResponse";
import { getRouteParam } from "../utils/request";

export class InquiryController {
  constructor(private readonly inquiryService = new InquiryService()) {}

  create = async (req: Request, res: Response) => {
    const data = await this.inquiryService.create(req.body);
    return sendSuccess(res, 201, "Inquiry submitted successfully", data);
  };

  list = async (req: Request, res: Response) => {
    const data = await this.inquiryService.list(req.query as never);
    return sendSuccess(res, 200, "Inquiries retrieved successfully", data);
  };

  updateStatus = async (req: Request, res: Response) => {
    const data = await this.inquiryService.updateStatus(getRouteParam(req, "id"), req.body.status);
    return sendSuccess(res, 200, "Inquiry status updated successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    await this.inquiryService.delete(getRouteParam(req, "id"));
    return sendSuccess(res, 200, "Inquiry deleted successfully");
  };
}
