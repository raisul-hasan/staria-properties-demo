import { Request, Response } from "express";
import { QuotationService } from "../services/quotation.service";
import { sendSuccess } from "../utils/apiResponse";

export class QuotationController {
  constructor(private readonly quotationService = new QuotationService()) {}

  submit = async (req: Request, res: Response) => {
    const data = await this.quotationService.submit(req.body, this.meta(req));
    return sendSuccess(res, 201, "Quotation request submitted successfully", data);
  };

  list = async (req: Request, res: Response) => {
    const data = await this.quotationService.list(req.query as never);
    return sendSuccess(res, 200, "Quotations retrieved successfully", data);
  };

  stats = async (_req: Request, res: Response) => {
    const data = await this.quotationService.stats();
    return sendSuccess(res, 200, "Quotation statistics retrieved successfully", data);
  };

  salesExecutives = async (_req: Request, res: Response) => {
    const data = await this.quotationService.salesExecutives();
    return sendSuccess(res, 200, "Sales executives retrieved successfully", data);
  };

  get = async (req: Request, res: Response) => {
    const data = await this.quotationService.get(this.param(req, "id"));
    return sendSuccess(res, 200, "Quotation retrieved successfully", data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.quotationService.update(this.param(req, "id"), req.body, req.user!.id, this.meta(req));
    return sendSuccess(res, 200, "Quotation updated successfully", data);
  };

  assign = async (req: Request, res: Response) => {
    const data = await this.quotationService.assign(this.param(req, "id"), req.body, req.user!.id, this.meta(req));
    return sendSuccess(res, 200, "Quotation assigned successfully", data);
  };

  changeStatus = async (req: Request, res: Response) => {
    const data = await this.quotationService.changeStatus(
      this.param(req, "id"),
      req.body,
      req.user!.id,
      this.meta(req)
    );
    return sendSuccess(res, 200, "Quotation status updated successfully", data);
  };

  conversations = async (req: Request, res: Response) => {
    const data = await this.quotationService.listConversations(this.param(req, "id"));
    return sendSuccess(res, 200, "Quotation conversations retrieved successfully", data);
  };

  addConversation = async (req: Request, res: Response) => {
    const data = await this.quotationService.addConversation(
      this.param(req, "id"),
      req.body,
      req.user!.id,
      this.meta(req)
    );
    return sendSuccess(res, 201, "Quotation conversation added successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    const data = await this.quotationService.softDelete(this.param(req, "id"), req.user!.id, this.meta(req));
    return sendSuccess(res, 200, "Quotation deleted successfully", data);
  };

  exportCsv = async (req: Request, res: Response) => {
    const data = await this.quotationService.exportCsv(req.query as never, req.user!.id, this.meta(req));

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${data.filename}"`);
    return res.status(200).send(data.content);
  };

  private meta(req: Request) {
    return {
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    };
  }

  private param(req: Request, name: string) {
    return String(req.params[name]);
  }
}
