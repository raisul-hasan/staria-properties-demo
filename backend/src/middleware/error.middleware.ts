import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { AppError } from "../utils/AppError";
import { sendError } from "../utils/apiResponse";

function getPrismaMessage(error: Prisma.PrismaClientKnownRequestError) {
  if (error.code === "P2002") return "A record with this value already exists";
  if (error.code === "P2025") return "Requested record was not found";
  return "Database request failed";
}

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = "Internal server error";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = error.code === "P2025" ? 404 : 400;
    message = getPrismaMessage(error);
  } else if (error instanceof Error) {
    statusCode = error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" ? 401 : 400;
    message = error.message;
  }

  if (statusCode >= 500 || env.NODE_ENV !== "production") {
    logger.error(message, { error });
  }

  return sendError(res, statusCode, message);
}
