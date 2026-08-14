import { prisma } from "../config/prisma";

export class HealthService {
  async check() {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString()
    };
  }
}
