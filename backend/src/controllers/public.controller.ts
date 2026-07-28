import { Request, Response } from "express";
import { CmsService } from "../services/cms.service";
import { sendSuccess } from "../utils/apiResponse";

export class PublicContentController {
  constructor(private readonly cmsService = new CmsService()) {}

  getProperties = async (req: Request, res: Response) => {
    const data = await this.cmsService.list("properties", { ...req.query, status: "PUBLISHED" });
    return sendSuccess(res, 200, "Published properties retrieved successfully", data);
  };

  getPropertyById = async (req: Request, res: Response) => {
    const data = await this.cmsService.getPublished("properties", String(req.params.id));
    return sendSuccess(res, 200, "Property detail retrieved successfully", data);
  };

  getProjects = async (req: Request, res: Response) => {
    const data = await this.cmsService.list("projects", { ...req.query, status: "PUBLISHED" });
    return sendSuccess(res, 200, "Published projects retrieved successfully", data);
  };

  getProjectById = async (req: Request, res: Response) => {
    const data = await this.cmsService.getPublished("projects", String(req.params.id));
    return sendSuccess(res, 200, "Project detail retrieved successfully", data);
  };

  getNews = async (req: Request, res: Response) => {
    const data = await this.cmsService.list("news", { ...req.query, status: "PUBLISHED" });
    return sendSuccess(res, 200, "Published news articles retrieved successfully", data);
  };

  getNewsById = async (req: Request, res: Response) => {
    const data = await this.cmsService.getPublished("news", String(req.params.id));
    return sendSuccess(res, 200, "News article retrieved successfully", data);
  };

  getFaqs = async (req: Request, res: Response) => {
    const data = await this.cmsService.list("faqs", { ...req.query, status: "PUBLISHED" });
    return sendSuccess(res, 200, "FAQs retrieved successfully", data);
  };

  getServices = async (req: Request, res: Response) => {
    const data = await this.cmsService.list("services", { ...req.query, status: "PUBLISHED" });
    return sendSuccess(res, 200, "Services retrieved successfully", data);
  };

  getTestimonials = async (req: Request, res: Response) => {
    const data = await this.cmsService.list("testimonials", { ...req.query, status: "PUBLISHED" });
    return sendSuccess(res, 200, "Testimonials retrieved successfully", data);
  };

  getGallery = async (req: Request, res: Response) => {
    const data = await this.cmsService.list("gallery", { ...req.query, status: "PUBLISHED" });
    return sendSuccess(res, 200, "Interior gallery items retrieved successfully", data);
  };

  getHeroSlides = async (req: Request, res: Response) => {
    const data = await this.cmsService.list("hero-slides", { ...req.query, status: "PUBLISHED" });
    return sendSuccess(res, 200, "Hero slides retrieved successfully", data);
  };

  getCompanyStats = async (req: Request, res: Response) => {
    const data = await this.cmsService.list("company-statistics", req.query);
    return sendSuccess(res, 200, "Company statistics retrieved successfully", data);
  };
}
