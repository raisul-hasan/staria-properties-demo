import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";

const server = app.listen(env.PORT, "0.0.0.0", () => {
  logger.info(`Staria Properties API running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

let isShuttingDown = false;

async function gracefulShutdown(signal: string, exitCode = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`${signal} signal received. Starting graceful shutdown...`);

  // Force exit after 10 seconds if connections are hanging
  const forceExitTimeout = setTimeout(() => {
    logger.error("Graceful shutdown timed out after 10s. Forcing exit.");
    process.exit(1);
  }, 10000);

  forceExitTimeout.unref();

  server.close(async (err) => {
    if (err) {
      logger.error("Error closing HTTP server listener", { error: err });
    } else {
      logger.info("HTTP server listener closed. No longer accepting new connections.");
    }

    try {
      await prisma.$disconnect();
      logger.info("Database connection pool closed successfully.");
    } catch (dbError) {
      logger.error("Error disconnecting database pool", { error: dbError });
    }

    logger.info("Graceful shutdown complete.");
    process.exit(exitCode);
  });
}

process.on("SIGTERM", () => void gracefulShutdown("SIGTERM", 0));
process.on("SIGINT", () => void gracefulShutdown("SIGINT", 0));

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception thrown", { error: error.message, stack: error.stack });
  void gracefulShutdown("UNCAUGHT_EXCEPTION", 1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Promise Rejection detected", { reason });
  void gracefulShutdown("UNHANDLED_REJECTION", 1);
});
