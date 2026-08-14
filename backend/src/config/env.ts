import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  API_PREFIX: z.string().default("/api/v1"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_ACCESS_SECRET: z.string().min(24, "JWT_ACCESS_SECRET must be at least 24 characters"),
  JWT_REFRESH_SECRET: z.string().min(24, "JWT_REFRESH_SECRET must be at least 24 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  ACCESS_TOKEN_COOKIE_NAME: z.string().default("staria_access_token"),
  REFRESH_TOKEN_COOKIE_NAME: z.string().default("staria_refresh_token"),
  ACCESS_TOKEN_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(7 * 24 * 60 * 60 * 1000),
  JWT_COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
  COOKIE_SAME_SITE: z.enum(["strict", "lax", "none"]).default("lax"),
  COOKIE_DOMAIN: z.string().optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  ADMIN_APP_URL: z.string().url().default("http://localhost:5174"),
  ENABLE_REGISTRATION: z
    .string()
    .default("true")
    .transform((value) => value === "true"),
  LOGIN_FAILURE_LIMIT: z.coerce.number().int().positive().default(5),
  ACCOUNT_LOCK_MINUTES: z.coerce.number().int().positive().default(30),
  PASSWORD_RESET_TOKEN_EXPIRES_MINUTES: z.coerce.number().int().positive().default(30),
  EMAIL_VERIFICATION_TOKEN_EXPIRES_HOURS: z.coerce.number().int().positive().default(24),
  MAX_ACTIVE_SESSIONS: z.coerce.number().int().positive().default(10),
  CORS_ORIGIN: z.string().default("*"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  FORM_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  FORM_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
  RECAPTCHA_MIN_SCORE: z.coerce.number().min(0).max(1).default(0.5),
  RECAPTCHA_REQUIRED: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().default("staria-properties"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default("Staria Properties <no-reply@staria.com.bd>"),
  ADMIN_EMAILS: z.string().default("info@staria.com.bd"),
  LOG_LEVEL: z.string().default("info")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.errors.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${message}`);
}

const config = parsed.data;

export const env = {
  ...config,
  corsOrigins:
    config.CORS_ORIGIN === "*"
      ? ["*"]
      : config.CORS_ORIGIN.split(",")
          .map((origin) => origin.trim())
          .filter(Boolean),
  adminEmails: config.ADMIN_EMAILS.split(",")
    .map((email) => email.trim())
    .filter(Boolean)
};

export type Env = typeof env;
