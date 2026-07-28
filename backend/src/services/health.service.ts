import { env } from "../config/env";
import { prisma } from "../config/prisma";

export class HealthService {
  async check() {
    let dbStatus = "connected";
    let isHealthy = true;

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = "disconnected";
      isHealthy = false;
    }

    const memoryUsage = process.memoryUsage();

    return {
      status: isHealthy ? "ok" : "degraded",
      database: dbStatus,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: env.API_PREFIX.replace(/^\//, ""),
      memory: {
        rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
        heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100
      }
    };
  }
}
