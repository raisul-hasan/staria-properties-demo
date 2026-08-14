import { Request, Response } from "express";
import { FaqService } from "../services/faq.service";
import { InteriorPortfolioService } from "../services/interiorPortfolio.service";
import { TestimonialService } from "../services/testimonial.service";
import { sendSuccess } from "../utils/apiResponse";
import { getRouteParam } from "../utils/request";

export class FaqController {
  constructor(private readonly faqService = new FaqService()) {}

  list = async (req: Request, res: Response) => {
    const data = await this.faqService.list(req.query as never);
    return sendSuccess(res, 200, "FAQs retrieved successfully", data);
  };

  adminList = async (req: Request, res: Response) => {
    const data = await this.faqService.list(req.query as never, true);
    return sendSuccess(res, 200, "FAQs retrieved successfully", data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.faqService.create(req.body);
    return sendSuccess(res, 201, "FAQ created successfully", data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.faqService.update(getRouteParam(req, "id"), req.body);
    return sendSuccess(res, 200, "FAQ updated successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    await this.faqService.delete(getRouteParam(req, "id"));
    return sendSuccess(res, 200, "FAQ deleted successfully");
  };
}

export class TestimonialController {
  constructor(private readonly testimonialService = new TestimonialService()) {}

  list = async (req: Request, res: Response) => {
    const data = await this.testimonialService.list(req.query as never);
    return sendSuccess(res, 200, "Testimonials retrieved successfully", data);
  };

  adminList = async (req: Request, res: Response) => {
    const data = await this.testimonialService.list(req.query as never, true);
    return sendSuccess(res, 200, "Testimonials retrieved successfully", data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.testimonialService.create(req.body);
    return sendSuccess(res, 201, "Testimonial created successfully", data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.testimonialService.update(getRouteParam(req, "id"), req.body);
    return sendSuccess(res, 200, "Testimonial updated successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    await this.testimonialService.delete(getRouteParam(req, "id"));
    return sendSuccess(res, 200, "Testimonial deleted successfully");
  };
}

export class InteriorPortfolioController {
  constructor(private readonly portfolioService = new InteriorPortfolioService()) {}

  list = async (req: Request, res: Response) => {
    const data = await this.portfolioService.list(req.query as never);
    return sendSuccess(res, 200, "Interior portfolio retrieved successfully", data);
  };

  adminList = async (req: Request, res: Response) => {
    const data = await this.portfolioService.list(req.query as never, true);
    return sendSuccess(res, 200, "Interior portfolio retrieved successfully", data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.portfolioService.create(req.body);
    return sendSuccess(res, 201, "Interior portfolio item created successfully", data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.portfolioService.update(getRouteParam(req, "id"), req.body);
    return sendSuccess(res, 200, "Interior portfolio item updated successfully", data);
  };

  delete = async (req: Request, res: Response) => {
    await this.portfolioService.delete(getRouteParam(req, "id"));
    return sendSuccess(res, 200, "Interior portfolio item deleted successfully");
  };
}
