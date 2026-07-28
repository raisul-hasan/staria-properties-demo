import helmet from "helmet";
import { env } from "./env";

export const helmetMiddleware = helmet({
  contentSecurityPolicy:
    env.NODE_ENV === "production"
      ? {
          directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            connectSrc: ["'self'", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            imgSrc: ["'self'", "https:", "data:", "blob:"],
            mediaSrc: ["'self'", "https:", "data:", "blob:"],
            objectSrc: ["'none'"],
            scriptSrc: ["'self'"],
            scriptSrcAttr: ["'none'"],
            styleSrc: ["'self'", "https:", "'unsafe-inline'"],
            upgradeInsecureRequests: []
          }
        }
      : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  hsts: env.NODE_ENV === "production" ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false
});

export const securityHeadersMiddleware = (_req: unknown, res: import("express").Response, next: import("express").NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.removeHeader("X-Powered-By");
  next();
};
