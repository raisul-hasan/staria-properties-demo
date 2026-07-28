import { Request, Response } from "express";
import { env } from "../config/env";
import { AuthService } from "../services/auth.service";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/apiResponse";
import { authCookieOptions, clearAuthCookieOptions, readCookie } from "../utils/cookies";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  bootstrap = async (req: Request, res: Response) => {
    const data = await this.authService.bootstrapOwner(req.body, this.meta(req));
    return sendSuccess(res, 201, "Owner admin bootstrapped successfully", data);
  };

  createAdmin = async (req: Request, res: Response) => {
    const data = await this.authService.createAdmin(req.body, req.user!.id, this.meta(req));
    return sendSuccess(res, 201, "Admin user created successfully", data);
  };

  login = async (req: Request, res: Response) => {
    const { accessToken, refreshToken, ...data } = await this.authService.login(req.body, this.meta(req));
    this.setAuthCookies(res, accessToken, refreshToken);
    return sendSuccess(res, 200, "Admin login successful", data);
  };

  me = async (req: Request, res: Response) => {
    const data = await this.authService.me(req.user!.id);
    return sendSuccess(res, 200, "Admin profile retrieved successfully", data);
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken ?? readCookie(req, env.REFRESH_TOKEN_COOKIE_NAME);
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }

    const { accessToken, refreshToken: rotatedRefreshToken, ...data } = await this.authService.refresh(
      refreshToken,
      this.meta(req)
    );
    this.setAuthCookies(res, accessToken, rotatedRefreshToken);
    return sendSuccess(res, 200, "Token refreshed successfully", data);
  };

  logout = async (req: Request, res: Response) => {
    await this.authService.logout(req.user!.id, req.user!.sessionId, this.meta(req));
    this.clearAuthCookies(res);
    return sendSuccess(res, 200, "Logout successful");
  };

  forgotPassword = async (req: Request, res: Response) => {
    await this.authService.forgotPassword(req.body, this.meta(req));
    return sendSuccess(res, 200, "If the admin email exists, a password reset link has been sent");
  };

  resetPassword = async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.body, this.meta(req));
    this.clearAuthCookies(res);
    return sendSuccess(res, 200, "Password reset successfully");
  };

  changePassword = async (req: Request, res: Response) => {
    await this.authService.changePassword(req.user!.id, req.body, this.meta(req));
    this.clearAuthCookies(res);
    return sendSuccess(res, 200, "Password changed successfully. Please sign in again.");
  };

  requestEmailVerification = async (req: Request, res: Response) => {
    await this.authService.requestEmailVerification(req.body, this.meta(req), req.user?.id);
    return sendSuccess(res, 200, "If verification is required, an email has been sent");
  };

  verifyEmail = async (req: Request, res: Response) => {
    await this.authService.verifyEmail(req.body.token, this.meta(req));
    return sendSuccess(res, 200, "Email verified successfully");
  };

  listSessions = async (req: Request, res: Response) => {
    const data = await this.authService.listSessions(req.user!.id);
    return sendSuccess(res, 200, "Active sessions retrieved successfully", data);
  };

  revokeSession = async (req: Request, res: Response) => {
    const sessionId = String(req.params.id);
    await this.authService.revokeSession(req.user!.id, sessionId, this.meta(req));
    if (sessionId === req.user!.sessionId) {
      this.clearAuthCookies(res);
    }
    return sendSuccess(res, 200, "Session revoked successfully");
  };

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie(
      env.ACCESS_TOKEN_COOKIE_NAME,
      accessToken,
      authCookieOptions(env.ACCESS_TOKEN_COOKIE_MAX_AGE_MS)
    );
    res.cookie(
      env.REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      authCookieOptions(env.REFRESH_TOKEN_COOKIE_MAX_AGE_MS)
    );
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie(env.ACCESS_TOKEN_COOKIE_NAME, clearAuthCookieOptions());
    res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, clearAuthCookieOptions());
  }

  private meta(req: Request) {
    return {
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    };
  }
}
