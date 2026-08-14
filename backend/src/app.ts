import compression from "compression";
import cors, { CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { morganStream } from "./config/logger";
import { swaggerSpec } from "./docs/swagger";
import { errorHandler, notFound } from "./middleware/error.middleware";
import { apiLimiter } from "./middleware/rateLimiter.middleware";
import routes from "./routes";
import { healthRouter } from "./routes/site.routes";

const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes("*") || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev", { stream: morganStream }));
app.use(apiLimiter);

app.use("/health", healthRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Staria Properties API is running",
    data: {
      docs: "/api-docs",
      health: "/health",
      api: env.API_PREFIX
    }
  });
});

app.use(env.API_PREFIX, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
