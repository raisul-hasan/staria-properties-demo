import rateLimit, { Options } from "express-rate-limit";
import { env } from "../config/env";
import { ErrorCodes } from "../core/errorCodes";

type RateLimitConfig = Pick<Options, "windowMs" | "max"> & {
  message: string;
};

function createRateLimiter({ windowMs, max, message }: RateLimitConfig) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        message,
        code: ErrorCodes.RATE_LIMITED,
        meta: {
          requestId: res.getHeader("x-request-id") ?? "unknown",
          timestamp: new Date().toISOString(),
          version: env.API_PREFIX.replace(/^\//, "")
        }
      });
    }
  });
}

export const apiLimiter = createRateLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: "Too many requests. Please try again later."
});

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again later."
});

export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: "Too many login attempts. Please try again later."
});

export const passwordRecoveryLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many password recovery attempts. Please try again later."
});

export const formLimiter = createRateLimiter({
  windowMs: env.FORM_RATE_LIMIT_WINDOW_MS,
  max: env.FORM_RATE_LIMIT_MAX,
  message: "Too many form submissions. Please try again later."
});
