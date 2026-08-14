import path from "path";
import winston from "winston";
import { env } from "./env";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: "staria-properties-api" },
  transports: [
    new winston.transports.Console({
      format:
        env.NODE_ENV === "production"
          ? logFormat
          : winston.format.combine(winston.format.colorize(), winston.format.simple())
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "error.log"),
      level: "error"
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "combined.log")
    })
  ]
});

export const morganStream = {
  write: (message: string) => logger.http(message.trim())
};
