import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "error" },
    { emit: "event", level: "warn" }
  ]
});

prisma.$on("error", (event) => {
  logger.error(event.message, { target: event.target });
});

prisma.$on("warn", (event) => {
  logger.warn(event.message, { target: event.target });
});
