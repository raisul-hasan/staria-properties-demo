import { Request, Response } from "express";
import { FormService } from "../services/form.service";
import { sendSuccess } from "../utils/apiResponse";

export class FormController {
  constructor(private readonly formService = new FormService()) {}

  submitContact = async (req: Request, res: Response) => {
    const data = await this.formService.submitContact(req.body, this.meta(req));
    return sendSuccess(res, 201, "Contact form submitted successfully", data);
  };

  subscribeNewsletter = async (req: Request, res: Response) => {
    const data = await this.formService.subscribeNewsletter(req.body, this.meta(req));
    return sendSuccess(res, 201, "Newsletter subscription saved successfully", data);
  };

  listContacts = async (req: Request, res: Response) => {
    const data = await this.formService.listContacts(req.query as never);
    return sendSuccess(res, 200, "Contact submissions retrieved successfully", data);
  };

  contactStats = async (_req: Request, res: Response) => {
    const data = await this.formService.contactStats();
    return sendSuccess(res, 200, "Contact submission statistics retrieved successfully", data);
  };

  getContact = async (req: Request, res: Response) => {
    const data = await this.formService.getContact(this.param(req, "id"));
    return sendSuccess(res, 200, "Contact submission retrieved successfully", data);
  };

  updateContact = async (req: Request, res: Response) => {
    const data = await this.formService.updateContact(this.param(req, "id"), req.body, req.user!.id, this.meta(req));
    return sendSuccess(res, 200, "Contact submission updated successfully", data);
  };

  deleteContact = async (req: Request, res: Response) => {
    const data = await this.formService.deleteContact(this.param(req, "id"), req.user!.id, this.meta(req));
    return sendSuccess(res, 200, "Contact submission deleted successfully", data);
  };

  listNewsletter = async (req: Request, res: Response) => {
    const data = await this.formService.listNewsletter(req.query as never);
    return sendSuccess(res, 200, "Newsletter subscribers retrieved successfully", data);
  };

  newsletterStats = async (_req: Request, res: Response) => {
    const data = await this.formService.newsletterStats();
    return sendSuccess(res, 200, "Newsletter statistics retrieved successfully", data);
  };

  getNewsletter = async (req: Request, res: Response) => {
    const data = await this.formService.getNewsletter(this.param(req, "id"));
    return sendSuccess(res, 200, "Newsletter subscriber retrieved successfully", data);
  };

  updateNewsletter = async (req: Request, res: Response) => {
    const data = await this.formService.updateNewsletter(this.param(req, "id"), req.body, req.user!.id, this.meta(req));
    return sendSuccess(res, 200, "Newsletter subscriber updated successfully", data);
  };

  deleteNewsletter = async (req: Request, res: Response) => {
    const data = await this.formService.deleteNewsletter(this.param(req, "id"), req.user!.id, this.meta(req));
    return sendSuccess(res, 200, "Newsletter subscriber deleted successfully", data);
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
