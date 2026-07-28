import { NextFunction, Request, Response } from "express";
import { AdminUserStatus } from "@prisma/client";
import { env } from "../config/env";
import { AuthRepository, AdminUserWithAccess } from "../repositories/auth.repository";
import { AppError } from "../utils/AppError";
import { readCookie } from "../utils/cookies";
import { verifyAccessToken } from "../utils/jwt";

const authRepository = new AuthRepository();

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = getBearerToken(req) ?? readCookie(req, env.ACCESS_TOKEN_COOKIE_NAME);
    if (!token) {
      throw new AppError("Authentication token is required", 401);
    }

    const payload = verifyAccessToken(token);
    const session = await authRepository.findSessionById(payload.sessionId);

    if (
      !session ||
      session.adminUserId !== payload.sub ||
      session.revokedAt ||
      session.expiresAt <= new Date() ||
      session.adminUser.deletedAt ||
      session.adminUser.status !== AdminUserStatus.ACTIVE
    ) {
      throw new AppError("Authentication session is invalid", 401);
    }

    if (!session.adminUser.emailVerifiedAt) {
      throw new AppError("Email verification is required", 403);
    }

    if (
      payload.iat &&
      session.adminUser.passwordChangedAt &&
      payload.iat * 1000 < session.adminUser.passwordChangedAt.getTime()
    ) {
      throw new AppError("Authentication token is no longer valid", 401);
    }

    const access = extractAccess(session.adminUser);
    req.user = {
      id: session.adminUser.id,
      email: session.adminUser.email,
      sessionId: session.id,
      roles: access.roles,
      permissions: access.permissions
    };

    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError("Invalid or expired authentication token", 401));
  }
}

export function authorize(...roles: string[]) {
  return requireRoles(...roles);
}

export function requireRoles(...roles: string[]) {
  const requiredRoles = roles.map((role) => role.toLowerCase());

  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Authentication token is required", 401));
      return;
    }

    const hasRole = req.user.roles.some((role) => requiredRoles.includes(role));
    if (!hasRole) {
      next(new AppError("You do not have permission to perform this action", 403));
      return;
    }

    next();
  };
}

export function requirePermissions(...permissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Authentication token is required", 401));
      return;
    }

    const missingPermission = permissions.find((permission) => !hasPermission(req.user!.permissions, permission));
    if (missingPermission) {
      next(new AppError("You do not have permission to perform this action", 403));
      return;
    }

    next();
  };
}

export function requireAnyPermission(...permissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Authentication token is required", 401));
      return;
    }

    if (!permissions.some((permission) => hasPermission(req.user!.permissions, permission))) {
      next(new AppError("You do not have permission to perform this action", 403));
      return;
    }

    next();
  };
}

function getBearerToken(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return undefined;
  return header.replace("Bearer ", "").trim();
}

export function hasPermission(adminPermissions: string[], requiredPermission: string) {
  if (adminPermissions.includes("*:*")) return true;
  if (adminPermissions.includes(requiredPermission)) return true;

  const [resource] = requiredPermission.split(":");
  return adminPermissions.includes(`${resource}:*`);
}

function extractAccess(admin: AdminUserWithAccess) {
  const roles = admin.roles
    .map(({ role }) => role)
    .filter((role) => !role.deletedAt)
    .map((role) => role.slug)
    .sort();

  const permissions = new Set<string>();
  admin.roles.forEach(({ role }) => {
    if (role.deletedAt) return;
    role.permissions.forEach(({ permission }) => {
      permissions.add(`${permission.resource}:${permission.action}`);
    });
  });

  if (roles.includes("owner") || roles.includes("super-admin")) {
    permissions.add("*:*");
  }

  return {
    roles,
    permissions: [...permissions].sort()
  };
}
