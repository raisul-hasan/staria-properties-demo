import { CorsOptions } from "cors";
import { env } from "./env";

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes("*") || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  exposedHeaders: ["X-Request-Id", "X-Response-Time", "X-API-Version", "RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"]
};
