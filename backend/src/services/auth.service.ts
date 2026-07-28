import { randomUUID } from "crypto";
import { AdminAction, AdminUserStatus } from "@prisma/client";
import { env } from "../config/env";
import { sendMail } from "../config/mail";
import { AuthRepository, AdminUserWithAccess } from "../repositories/auth.repository";
import { AppError } from "../utils/AppError";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateOpaqueToken, hashOpaqueToken } from "../utils/secureToken";

export type RequestMeta = {
  ipAddress?: string;
  userAgent?: string;
};

type CreateAdminInput = {
  name: string;
  email: string;
  password: string;
  roleSlugs: string[];
  sendVerificationEmail?: boolean;
};

type LoginInput = {
  email: string;
  password: string;
};

type ForgotPasswordInput = {
  email: string;
};

type ResetPasswordInput = {
  token: string;
  password: string;
};

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type RequestEmailVerificationInput = {
  email?: string;
};

type SessionSnapshot = {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const OWNER_ROLE = "owner";
const ROOT_ROLE_SLUGS = new Set([OWNER_ROLE, "super-admin"]);

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

  async bootstrapOwner(input: CreateAdminInput, meta: RequestMeta) {
    const existingAdmins = await this.authRepository.countAdmins();
    if (!env.ENABLE_REGISTRATION || existingAdmins > 0) {
      throw new AppError("Admin bootstrap is disabled", 403);
    }

    const admin = await this.createAdminRecord(
      {
        ...input,
        roleSlugs: [OWNER_ROLE],
        sendVerificationEmail: false
      },
      { emailVerifiedAt: new Date() }
    );

    await this.audit({
      actorId: admin.id,
      action: AdminAction.CREATE,
      entityType: "AdminUser",
      entityId: admin.id,
      afterData: { email: admin.email, bootstrap: true },
      ...meta
    });

    return { admin: this.sanitizeAdmin(admin) };
  }

  async createAdmin(input: CreateAdminInput, actorId: string, meta: RequestMeta) {
    const actor = await this.authRepository.findAdminById(actorId);
    if (!actor) {
      throw new AppError("Authenticated admin was not found", 401);
    }

    const admin = await this.createAdminRecord(input, { emailVerifiedAt: null });

    await this.audit({
      actorId,
      action: AdminAction.CREATE,
      entityType: "AdminUser",
      entityId: admin.id,
      afterData: { email: admin.email, roles: this.extractRoleSlugs(admin) },
      ...meta
    });

    if (input.sendVerificationEmail !== false) {
      await this.issueEmailVerification(admin, meta);
    }

    return { admin: this.sanitizeAdmin(admin) };
  }

  async login(input: LoginInput, meta: RequestMeta) {
    const admin = await this.authRepository.findAdminByEmail(input.email);

    if (!admin || admin.deletedAt || admin.status !== AdminUserStatus.ACTIVE) {
      await this.audit({
        actorId: admin?.id,
        action: AdminAction.LOGIN_FAILED,
        entityType: "AdminUser",
        entityId: admin?.id,
        afterData: { email: input.email, reason: "invalid_credentials_or_inactive" },
        ...meta
      });
      throw new AppError("Invalid email or password", 401);
    }

    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      await this.audit({
        actorId: admin.id,
        action: AdminAction.LOGIN_FAILED,
        entityType: "AdminUser",
        entityId: admin.id,
        afterData: { email: admin.email, reason: "account_locked", lockedUntil: admin.lockedUntil.toISOString() },
        ...meta
      });
      throw new AppError("Account is temporarily locked. Please try again later.", 423);
    }

    const passwordMatches = await verifyPassword(input.password, admin.passwordHash);
    if (!passwordMatches) {
      await this.handleFailedLogin(admin, meta);
      throw new AppError("Invalid email or password", 401);
    }

    if (!admin.emailVerifiedAt) {
      await this.audit({
        actorId: admin.id,
        action: AdminAction.LOGIN_FAILED,
        entityType: "AdminUser",
        entityId: admin.id,
        afterData: { email: admin.email, reason: "email_unverified" },
        ...meta
      });
      throw new AppError("Email verification is required before login", 403);
    }

    await this.authRepository.resetLoginFailures(admin.id);
    await this.enforceSessionLimit(admin.id);

    const tokens = await this.createTokenPair(admin, undefined, meta);

    await this.audit({
      actorId: admin.id,
      action: AdminAction.LOGIN,
      entityType: "AdminSession",
      entityId: tokens.session.id,
      afterData: { email: admin.email },
      ...meta
    });

    return {
      admin: this.sanitizeAdmin(admin),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      session: this.sanitizeSession(tokens.session)
    };
  }

  async me(adminId: string) {
    const admin = await this.authRepository.findAdminById(adminId);
    if (!admin || admin.status !== AdminUserStatus.ACTIVE) {
      throw new AppError("Admin account was not found", 404);
    }

    return this.sanitizeAdmin(admin);
  }

  async refresh(refreshToken: string, meta: RequestMeta) {
    const payload = verifyRefreshToken(refreshToken);
    const session = await this.authRepository.findSessionById(payload.sessionId);

    if (!session || session.adminUserId !== payload.sub || session.tokenFamily !== payload.tokenFamily) {
      throw new AppError("Refresh token is invalid", 401);
    }

    if (session.revokedAt) {
      await this.authRepository.revokeUserSessions(session.adminUserId);
      await this.audit({
        actorId: session.adminUserId,
        action: AdminAction.SESSION_REVOKED,
        entityType: "AdminSession",
        entityId: session.id,
        afterData: { reason: "refresh_token_reuse_detected" },
        ...meta
      });
      throw new AppError("Refresh token is invalid", 401);
    }

    if (session.expiresAt <= new Date()) {
      await this.authRepository.revokeSession(session.id);
      throw new AppError("Refresh token has expired", 401);
    }

    const tokenMatches = await verifyPassword(refreshToken, session.refreshTokenHash);
    if (!tokenMatches) {
      await this.authRepository.revokeUserSessions(session.adminUserId);
      throw new AppError("Refresh token is invalid", 401);
    }

    this.assertAdminCanAuthenticate(session.adminUser);

    const tokens = await this.createTokenPair(session.adminUser, session.tokenFamily, meta);
    await this.authRepository.revokeSession(session.id, tokens.session.id);

    await this.audit({
      actorId: session.adminUserId,
      action: AdminAction.AUTH_REFRESH,
      entityType: "AdminSession",
      entityId: tokens.session.id,
      afterData: { previousSessionId: session.id },
      ...meta
    });

    return {
      admin: this.sanitizeAdmin(session.adminUser),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      session: this.sanitizeSession(tokens.session)
    };
  }

  async logout(adminId: string, sessionId: string, meta: RequestMeta) {
    await this.authRepository.revokeSession(sessionId);
    await this.audit({
      actorId: adminId,
      action: AdminAction.LOGOUT,
      entityType: "AdminSession",
      entityId: sessionId,
      ...meta
    });
  }

  async forgotPassword(input: ForgotPasswordInput, meta: RequestMeta) {
    const admin = await this.authRepository.findAdminByEmail(input.email);

    if (admin && !admin.deletedAt && admin.status === AdminUserStatus.ACTIVE) {
      const token = generateOpaqueToken();
      await this.authRepository.createPasswordResetToken({
        adminUserId: admin.id,
        tokenHash: hashOpaqueToken(token),
        requestedIp: meta.ipAddress,
        userAgent: meta.userAgent,
        expiresAt: this.minutesFromNow(env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES)
      });

      await this.audit({
        actorId: admin.id,
        action: AdminAction.PASSWORD_RESET_REQUEST,
        entityType: "AdminUser",
        entityId: admin.id,
        ...meta
      });

      await this.sendPasswordResetEmail(admin, token);
    }

    return null;
  }

  async resetPassword(input: ResetPasswordInput, meta: RequestMeta) {
    const tokenHash = hashOpaqueToken(input.token);
    const resetToken = await this.authRepository.findPasswordResetToken(tokenHash);

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
      throw new AppError("Password reset token is invalid or expired", 400);
    }

    this.assertAdminCanAuthenticate(resetToken.adminUser, { allowUnverifiedEmail: true });

    const passwordHash = await hashPassword(input.password);
    await this.authRepository.updatePassword(resetToken.adminUserId, passwordHash);
    await this.authRepository.markPasswordResetTokenUsed(resetToken.id);
    await this.authRepository.revokeUserSessions(resetToken.adminUserId);

    await this.audit({
      actorId: resetToken.adminUserId,
      action: AdminAction.PASSWORD_RESET,
      entityType: "AdminUser",
      entityId: resetToken.adminUserId,
      ...meta
    });

    return null;
  }

  async changePassword(adminId: string, input: ChangePasswordInput, meta: RequestMeta) {
    const admin = await this.authRepository.findAdminById(adminId);
    if (!admin) {
      throw new AppError("Admin account was not found", 404);
    }

    const currentPasswordMatches = await verifyPassword(input.currentPassword, admin.passwordHash);
    if (!currentPasswordMatches) {
      throw new AppError("Current password is incorrect", 400);
    }

    const reusesCurrentPassword = await verifyPassword(input.newPassword, admin.passwordHash);
    if (reusesCurrentPassword) {
      throw new AppError("New password must be different from the current password", 400);
    }

    await this.authRepository.updatePassword(admin.id, await hashPassword(input.newPassword));
    await this.authRepository.revokeUserSessions(admin.id);
    await this.audit({
      actorId: admin.id,
      action: AdminAction.PASSWORD_RESET,
      entityType: "AdminUser",
      entityId: admin.id,
      afterData: { reason: "authenticated_change" },
      ...meta
    });

    return null;
  }

  async requestEmailVerification(input: RequestEmailVerificationInput, meta: RequestMeta, adminId?: string) {
    const admin = adminId
      ? await this.authRepository.findAdminById(adminId)
      : input.email
        ? await this.authRepository.findAdminByEmail(input.email)
        : null;

    if (admin && !admin.emailVerifiedAt && !admin.deletedAt && admin.status === AdminUserStatus.ACTIVE) {
      await this.issueEmailVerification(admin, meta);
    }

    return null;
  }

  async verifyEmail(token: string, meta: RequestMeta) {
    const tokenHash = hashOpaqueToken(token);
    const verificationToken = await this.authRepository.findEmailVerificationToken(tokenHash);

    if (!verificationToken || verificationToken.usedAt || verificationToken.expiresAt <= new Date()) {
      throw new AppError("Email verification token is invalid or expired", 400);
    }

    await this.authRepository.markEmailVerified(verificationToken.adminUserId);
    await this.authRepository.markEmailVerificationTokenUsed(verificationToken.id);

    await this.audit({
      actorId: verificationToken.adminUserId,
      action: AdminAction.EMAIL_VERIFIED,
      entityType: "AdminUser",
      entityId: verificationToken.adminUserId,
      ...meta
    });

    return null;
  }

  async listSessions(adminId: string) {
    const sessions = await this.authRepository.listActiveSessions(adminId);
    return sessions.map((session) => this.sanitizeSession(session));
  }

  async revokeSession(adminId: string, sessionId: string, meta: RequestMeta) {
    const session = await this.authRepository.findSessionById(sessionId);
    if (!session || session.adminUserId !== adminId) {
      throw new AppError("Session was not found", 404);
    }

    await this.authRepository.revokeSession(sessionId);
    await this.audit({
      actorId: adminId,
      action: AdminAction.SESSION_REVOKED,
      entityType: "AdminSession",
      entityId: sessionId,
      afterData: { reason: "manual_revoke" },
      ...meta
    });
  }

  private async createAdminRecord(input: CreateAdminInput, options: { emailVerifiedAt: Date | null }) {
    const existingAdmin = await this.authRepository.findAdminByEmail(input.email);
    if (existingAdmin) {
      throw new AppError("An admin with this email already exists", 409);
    }

    const roleSlugs = [...new Set(input.roleSlugs.map((role) => role.trim().toLowerCase()))];
    const roles = await this.authRepository.findRolesBySlugs(roleSlugs);
    if (roles.length !== roleSlugs.length) {
      throw new AppError("One or more admin roles are invalid", 400);
    }

    const passwordHash = await hashPassword(input.password);
    return this.authRepository.createAdmin({
      name: input.name,
      email: input.email,
      passwordHash,
      emailVerifiedAt: options.emailVerifiedAt,
      roleIds: roles.map((role) => role.id)
    });
  }

  private async createTokenPair(admin: AdminUserWithAccess, tokenFamily: string = randomUUID(), meta: RequestMeta) {
    const sessionId = randomUUID();
    const access = this.extractAccess(admin);
    const accessToken = signAccessToken({
      sub: admin.id,
      email: admin.email,
      sessionId,
      roles: access.roles,
      permissions: access.permissions
    });
    const refreshToken = signRefreshToken({
      sub: admin.id,
      email: admin.email,
      sessionId,
      tokenFamily
    });

    const session = await this.authRepository.createSession({
      id: sessionId,
      adminUserId: admin.id,
      refreshTokenHash: await hashPassword(refreshToken),
      tokenFamily,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_COOKIE_MAX_AGE_MS)
    });

    return { accessToken, refreshToken, session };
  }

  private async handleFailedLogin(admin: AdminUserWithAccess, meta: RequestMeta) {
    const failedLoginAttempts = admin.failedLoginAttempts + 1;
    const lockAccount = failedLoginAttempts >= env.LOGIN_FAILURE_LIMIT;
    const lockedUntil = lockAccount ? this.minutesFromNow(env.ACCOUNT_LOCK_MINUTES) : null;

    await this.authRepository.updateLoginFailure(admin.id, failedLoginAttempts, lockedUntil);
    await this.audit({
      actorId: admin.id,
      action: lockAccount ? AdminAction.ACCOUNT_LOCKED : AdminAction.LOGIN_FAILED,
      entityType: "AdminUser",
      entityId: admin.id,
      afterData: {
        email: admin.email,
        failedLoginAttempts,
        lockedUntil: lockedUntil?.toISOString()
      },
      ...meta
    });
  }

  private async enforceSessionLimit(adminId: string) {
    const activeSessionCount = await this.authRepository.countActiveSessions(adminId);
    if (activeSessionCount < env.MAX_ACTIVE_SESSIONS) return;

    const sessionsToRevoke = await this.authRepository.findOldestActiveSessions(
      adminId,
      activeSessionCount - env.MAX_ACTIVE_SESSIONS + 1
    );

    await Promise.all(sessionsToRevoke.map((session) => this.authRepository.revokeSession(session.id)));
  }

  private assertAdminCanAuthenticate(
    admin: AdminUserWithAccess,
    options: { allowUnverifiedEmail?: boolean } = {}
  ) {
    if (admin.deletedAt || admin.status !== AdminUserStatus.ACTIVE) {
      throw new AppError("Admin account is not active", 401);
    }

    if (!options.allowUnverifiedEmail && !admin.emailVerifiedAt) {
      throw new AppError("Email verification is required", 403);
    }
  }

  private async issueEmailVerification(admin: AdminUserWithAccess, meta: RequestMeta) {
    const token = generateOpaqueToken();
    await this.authRepository.createEmailVerificationToken({
      adminUserId: admin.id,
      tokenHash: hashOpaqueToken(token),
      requestedIp: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt: this.hoursFromNow(env.EMAIL_VERIFICATION_TOKEN_EXPIRES_HOURS)
    });

    await this.audit({
      actorId: admin.id,
      action: AdminAction.EMAIL_VERIFICATION_REQUEST,
      entityType: "AdminUser",
      entityId: admin.id,
      ...meta
    });

    await this.sendEmailVerification(admin, token);
  }

  private async sendPasswordResetEmail(admin: AdminUserWithAccess, token: string) {
    const resetUrl = `${env.ADMIN_APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
    await sendMail({
      to: admin.email,
      subject: "Reset your Staria admin password",
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Hello ${admin.name},</p><p>Use the link below to reset your Staria admin password. This link expires in ${env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES} minutes.</p><p><a href="${resetUrl}">Reset password</a></p>`
    });
  }

  private async sendEmailVerification(admin: AdminUserWithAccess, token: string) {
    const verificationUrl = `${env.ADMIN_APP_URL}/verify-email?token=${encodeURIComponent(token)}`;
    await sendMail({
      to: admin.email,
      subject: "Verify your Staria admin email",
      text: `Verify your email: ${verificationUrl}`,
      html: `<p>Hello ${admin.name},</p><p>Please verify your Staria admin email address.</p><p><a href="${verificationUrl}">Verify email</a></p>`
    });
  }

  private extractAccess(admin: AdminUserWithAccess) {
    const roles = this.extractRoleSlugs(admin);
    const permissionSet = new Set<string>();

    admin.roles.forEach(({ role }) => {
      if (role.deletedAt) return;
      role.permissions.forEach(({ permission }) => {
        permissionSet.add(`${permission.resource}:${permission.action}`);
      });
    });

    if (roles.some((role) => ROOT_ROLE_SLUGS.has(role))) {
      permissionSet.add("*:*");
    }

    return {
      roles,
      permissions: [...permissionSet].sort()
    };
  }

  private extractRoleSlugs(admin: AdminUserWithAccess) {
    return admin.roles
      .map(({ role }) => role)
      .filter((role) => !role.deletedAt)
      .map((role) => role.slug)
      .sort();
  }

  private sanitizeAdmin(admin: AdminUserWithAccess) {
    const access = this.extractAccess(admin);
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      status: admin.status,
      emailVerifiedAt: admin.emailVerifiedAt,
      lastLoginAt: admin.lastLoginAt,
      roles: admin.roles
        .map(({ role }) => role)
        .filter((role) => !role.deletedAt)
        .map((role) => ({
          id: role.id,
          name: role.name,
          slug: role.slug
        })),
      permissions: access.permissions,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };
  }

  private sanitizeSession(session: SessionSnapshot) {
    return {
      id: session.id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    };
  }

  private minutesFromNow(minutes: number) {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  private hoursFromNow(hours: number) {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  private audit(input: Parameters<AuthRepository["createAuditLog"]>[0]) {
    return this.authRepository.createAuditLog(input);
  }
}
