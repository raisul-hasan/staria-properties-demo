import { AdminAction, AdminUserStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

const adminAccessInclude = {
  roles: {
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  }
} satisfies Prisma.AdminUserInclude;

const sessionWithAdminInclude = {
  adminUser: {
    include: adminAccessInclude
  }
} satisfies Prisma.AdminSessionInclude;

export type AdminUserWithAccess = Prisma.AdminUserGetPayload<{ include: typeof adminAccessInclude }>;
export type AdminSessionWithAdmin = Prisma.AdminSessionGetPayload<{ include: typeof sessionWithAdminInclude }>;

export type AuditInput = {
  actorId?: string | null;
  action: AdminAction;
  entityType: string;
  entityId?: string | null;
  beforeData?: Prisma.InputJsonValue;
  afterData?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
};

export class AuthRepository {
  countAdmins() {
    return prisma.adminUser.count({
      where: { deletedAt: null }
    });
  }

  findAdminByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email },
      include: adminAccessInclude
    });
  }

  findAdminById(id: string) {
    return prisma.adminUser.findFirst({
      where: { id, deletedAt: null },
      include: adminAccessInclude
    });
  }

  createAdmin(data: {
    name: string;
    email: string;
    passwordHash: string;
    status?: AdminUserStatus;
    emailVerifiedAt?: Date | null;
    roleIds: string[];
  }) {
    return prisma.adminUser.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        status: data.status ?? AdminUserStatus.ACTIVE,
        emailVerifiedAt: data.emailVerifiedAt,
        roles: {
          create: data.roleIds.map((roleId) => ({
            role: {
              connect: { id: roleId }
            }
          }))
        }
      },
      include: adminAccessInclude
    });
  }

  findRolesBySlugs(slugs: string[]) {
    return prisma.role.findMany({
      where: {
        slug: { in: slugs },
        deletedAt: null
      }
    });
  }

  updateLoginFailure(adminUserId: string, failedLoginAttempts: number, lockedUntil?: Date | null) {
    return prisma.adminUser.update({
      where: { id: adminUserId },
      data: {
        failedLoginAttempts,
        lockedUntil
      }
    });
  }

  resetLoginFailures(adminUserId: string) {
    return prisma.adminUser.update({
      where: { id: adminUserId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date()
      }
    });
  }

  updatePassword(adminUserId: string, passwordHash: string) {
    return prisma.adminUser.update({
      where: { id: adminUserId },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    });
  }

  markEmailVerified(adminUserId: string) {
    return prisma.adminUser.update({
      where: { id: adminUserId },
      data: {
        emailVerifiedAt: new Date()
      }
    });
  }

  createSession(data: {
    id: string;
    adminUserId: string;
    refreshTokenHash: string;
    tokenFamily: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    return prisma.adminSession.create({
      data
    });
  }

  findSessionById(id: string) {
    return prisma.adminSession.findUnique({
      where: { id },
      include: sessionWithAdminInclude
    });
  }

  listActiveSessions(adminUserId: string) {
    return prisma.adminSession.findMany({
      where: {
        adminUserId,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  countActiveSessions(adminUserId: string) {
    return prisma.adminSession.count({
      where: {
        adminUserId,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    });
  }

  findOldestActiveSessions(adminUserId: string, take: number) {
    return prisma.adminSession.findMany({
      where: {
        adminUserId,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: "asc" },
      take
    });
  }

  revokeSession(id: string, replacedBySessionId?: string | null) {
    return prisma.adminSession.updateMany({
      where: {
        id,
        revokedAt: null
      },
      data: {
        revokedAt: new Date(),
        replacedBySessionId
      }
    });
  }

  revokeUserSessions(adminUserId: string) {
    return prisma.adminSession.updateMany({
      where: {
        adminUserId,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  }

  createPasswordResetToken(data: {
    adminUserId: string;
    tokenHash: string;
    requestedIp?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    return prisma.adminPasswordResetToken.create({
      data
    });
  }

  findPasswordResetToken(tokenHash: string) {
    return prisma.adminPasswordResetToken.findUnique({
      where: { tokenHash },
      include: {
        adminUser: {
          include: adminAccessInclude
        }
      }
    });
  }

  markPasswordResetTokenUsed(id: string) {
    return prisma.adminPasswordResetToken.update({
      where: { id },
      data: { usedAt: new Date() }
    });
  }

  createEmailVerificationToken(data: {
    adminUserId: string;
    tokenHash: string;
    requestedIp?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    return prisma.adminEmailVerificationToken.create({
      data
    });
  }

  findEmailVerificationToken(tokenHash: string) {
    return prisma.adminEmailVerificationToken.findUnique({
      where: { tokenHash },
      include: {
        adminUser: {
          include: adminAccessInclude
        }
      }
    });
  }

  markEmailVerificationTokenUsed(id: string) {
    return prisma.adminEmailVerificationToken.update({
      where: { id },
      data: { usedAt: new Date() }
    });
  }

  createAuditLog(input: AuditInput) {
    return prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        beforeData: input.beforeData,
        afterData: input.afterData,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent
      }
    });
  }
}
