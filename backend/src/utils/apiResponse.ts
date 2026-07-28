import { Response } from "express";
import { ZodSchema } from "zod";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { ApiSuccess, responseMetaSchema } from "../core/apiSchemas";
import { ErrorCode, FieldError, statusToErrorCode } from "../core/errorCodes";
import { getRequestId } from "../core/requestContext";

type SendSuccessOptions<T> = {
  schema?: ZodSchema<T>;
};

function buildMeta(res: Response) {
  return responseMetaSchema.parse({
    requestId: getRequestId(res.req),
    timestamp: new Date().toISOString(),
    version: env.API_PREFIX.replace(/^\//, "")
  });
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  options?: SendSuccessOptions<T>
) {
  if (options?.schema && data !== undefined) {
    const parsed = options.schema.safeParse(data);
    if (!parsed.success) {
      logger.error("Response validation failed", {
        requestId: getRequestId(res.req),
        issues: parsed.error.errors
      });
      if (env.NODE_ENV !== "production") {
        throw parsed.error;
      }
    } else {
      data = parsed.data;
    }
  }

  const payload: ApiSuccess<T> = {
    success: true,
    message,
    meta: buildMeta(res)
  };

  if (data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  options?: {
    code?: ErrorCode;
    errors?: FieldError[];
  }
) {
  return res.status(statusCode).json({
    success: false,
    message,
    code: options?.code ?? statusToErrorCode(statusCode),
    errors: options?.errors,
    meta: buildMeta(res)
  });
}
