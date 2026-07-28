import { NextFunction, Request, Response } from "express";
import { performance } from "perf_hooks";
import { logger } from "../config/logger";
import { getRequestId } from "../core/requestContext";

const SLOW_REQUEST_MS = 1000;

export function performanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = performance.now();
  const originalEnd = res.end.bind(res);

  res.end = ((...args: Parameters<Response["end"]>) => {
    const durationMs = Math.round(performance.now() - start);
    if (!res.headersSent) {
      res.setHeader("X-Response-Time", `${durationMs}ms`);
    }
    return originalEnd(...args);
  }) as Response["end"];

  res.on("finish", () => {
    const durationMs = Math.round(performance.now() - start);

    const payload = {
      requestId: getRequestId(req),
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      userId: req.user?.id
    };

    if (durationMs >= SLOW_REQUEST_MS || res.statusCode >= 500) {
      logger.warn("Slow or failed request", payload);
      return;
    }

    if (req.originalUrl.startsWith("/health")) {
      return;
    }

    logger.info("Request completed", payload);
  });

  next();
}
