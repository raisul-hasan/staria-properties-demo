import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { logger } from "../config/logger";
import { getRequestId } from "../core/requestContext";

export function validateResponse<T>(schema: ZodSchema<T>) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = (body: unknown) => {
      if (body && typeof body === "object" && "success" in body && (body as { success: boolean }).success) {
        const data = (body as { data?: unknown }).data;
        if (data !== undefined) {
          const parsed = schema.safeParse(data);
          if (!parsed.success) {
            logger.error("Response schema validation failed", {
              requestId: getRequestId(res.req),
              issues: parsed.error.errors
            });
          }
        }
      }

      return originalJson(body);
    };

    next();
  };
}
