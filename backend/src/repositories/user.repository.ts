import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../config/prisma";

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  findActiveById(id: string) {
    return prisma.user.findFirst({ where: { id, isActive: true } });
  }

  countUsers() {
    return prisma.user.count();
  }

  create(data: { name: string; email: string; passwordHash: string; role?: UserRole }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: data.role ?? "EDITOR"
      }
    });
  }

  updateRefreshTokenHash(id: string, refreshTokenHash: string | null) {
    return prisma.user.update({
      where: { id },
      data: { refreshTokenHash }
    });
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }
}
