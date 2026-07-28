import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { ErrorCode, ErrorCodes } from "../core/errorCodes";
import { AppError } from "../utils/AppError";
import { sendError } from "../utils/apiResponse";
import { getRequestId } from "../core/requestContext";

function getPrismaError(error: Prisma.PrismaClientKnownRequestError) {
  if (error.code === "P2002") {
    return {
      statusCode: 409,
      message: "A record with this value already exists",
      code: ErrorCodes.CONFLICT
    };
  }

  if (error.code === "P2025") {
    return {
      statusCode: 404,
      message: "Requested record was not found",
      code: ErrorCodes.NOT_FOUND
    };
  }

  return {
    statusCode: 400,
    message: "Database request failed",
    code: ErrorCodes.DATABASE_ERROR
  };
}

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = getRequestId(req);
  let statusCode = 500;
  let message = "Internal server error";
  let code: ErrorCode = ErrorCodes.INTERNAL_ERROR;
  let errors: AppError["errors"];

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
    errors = error.errors;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = getPrismaError(error);
    statusCode = mapped.statusCode;
    message = mapped.message;
    code = mapped.code;
  } else if (error instanceof Error) {
    if (error.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token";
      code = ErrorCodes.TOKEN_INVALID;
    } else if (error.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired";
      code = ErrorCodes.TOKEN_EXPIRED;
    } else if (error.message === "Not allowed by CORS") {
      statusCode = 403;
      message = error.message;
      code = ErrorCodes.FORBIDDEN;
    } else {
      statusCode = 400;
      message = error.message;
      code = ErrorCodes.VALIDATION_FAILED;
    }
  }

  if (statusCode >= 500) {
    message = env.NODE_ENV === "production" ? "Internal server error" : message;
    logger.error("Unhandled server error", { requestId, error, statusCode });
  } else if (statusCode >= 400) {
    logger.warn("Client error", { requestId, statusCode, message, code, errors });
  }

  return sendError(res, statusCode, message, { code, errors });
}
