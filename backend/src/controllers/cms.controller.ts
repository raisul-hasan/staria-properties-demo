import { Request, Response } from "express";
import { CmsService } from "../services/cms.service";
import { UploadService } from "../services/upload.service";
import { sendSuccess } from "../utils/apiResponse";

export class CmsController {
  constructor(
    private readonly cmsService = new CmsService(),
    private readonly uploadService = new UploadService()
  ) {}

  list = async (req: Request, res: Response) => {
    const data = await this.cmsService.list(this.param(req, "resource"), req.query);
    return sendSuccess(res, 200, "CMS records retrieved successfully", data);
  };

  get = async (req: Request, res: Response) => {
    const data = await this.cmsService.get(this.param(req, "resource"), this.param(req, "id"));
    return sendSuccess(res, 200, "CMS record retrieved successfully", data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.cmsService.create(this.param(req, "resource"), req.body, req.user!.id, this.meta(req));
    return sendSuccess(res, 201, "CMS record created successfully", data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.cmsService.update(
      this.param(req, "resource"),
      this.param(req, "id"),
      req.body,
      req.user!.id,
      this.meta(req)
    );
    return sendSuccess(res, 200, "CMS record updated successfully", data);
  };

  publish = async (req: Request, res: Response) => {
    const data = await this.cmsService.publish(
      this.param(req, "resource"),
      this.param(req, "id"),
      req.user!.id,
      this.meta(req)
    );
    return sendSuccess(res, 200, "CMS record published successfully", data);
  };

  draft = async (req: Request, res: Response) => {
    const data = await this.cmsService.draft(
      this.param(req, "resource"),
      this.param(req, "id"),
      req.user!.id,
      this.meta(req)
    );
    return sendSuccess(res, 200, "CMS record moved to draft successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    const data = await this.cmsService.softDelete(
      this.param(req, "resource"),
      this.param(req, "id"),
      req.user!.id,
      this.meta(req)
    );
    return sendSuccess(res, 200, "CMS record deleted successfully", data);
  };

  restore = async (req: Request, res: Response) => {
    const data = await this.cmsService.restore(
      this.param(req, "resource"),
      this.param(req, "id"),
      req.user!.id,
      this.meta(req)
    );
    return sendSuccess(res, 200, "CMS record restored successfully", data);
  };

  uploadImage = async (req: Request, res: Response) => {
    const data = await this.uploadService.uploadImage(req.file, req.user?.id, req.body.altText);
    return sendSuccess(res, 201, "Image uploaded successfully", data);
  };

  listMedia = async (req: Request, res: Response) => {
    const data = await this.uploadService.list(req.query as never);
    return sendSuccess(res, 200, "Media library retrieved successfully", data);
  };

  uploadFile = async (req: Request, res: Response) => {
    const data = await this.uploadService.uploadFile(req.file, req.user?.id, req.body.altText);
    return sendSuccess(res, 201, "File uploaded successfully", data);
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
