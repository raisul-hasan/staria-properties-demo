import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export type CachePolicy = {
  maxAgeSeconds: number;
  staleWhileRevalidateSeconds?: number;
  private?: boolean;
  noStore?: boolean;
  etag?: boolean;
};

export function cacheControl(policy: CachePolicy) {
  return (_req: Request, res: Response, next: NextFunction) => {
    if (policy.noStore) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      next();
      return;
    }

    const visibility = policy.private ? "private" : "public";
    const directives = [`${visibility}`, `max-age=${policy.maxAgeSeconds}`];

    if (policy.staleWhileRevalidateSeconds) {
      directives.push(`stale-while-revalidate=${policy.staleWhileRevalidateSeconds}`);
    }

    res.setHeader("Cache-Control", directives.join(", "));

    if (policy.etag) {
      res.setHeader("Vary", "Accept-Encoding");
    }

    next();
  };
}

export const cachePolicies = {
  noStore: cacheControl({ maxAgeSeconds: 0, noStore: true }),
  publicShort: cacheControl({ maxAgeSeconds: 60, staleWhileRevalidateSeconds: 120, etag: true }),
  publicMedium: cacheControl({ maxAgeSeconds: 300, staleWhileRevalidateSeconds: 600, etag: true }),
  privateShort: cacheControl({ maxAgeSeconds: 30, private: true })
};

export function apiVersionMiddleware(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-API-Version", env.API_PREFIX.replace(/^\//, ""));
  next();
}
