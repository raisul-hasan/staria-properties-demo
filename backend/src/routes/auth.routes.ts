import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { authLimiter, loginLimiter, passwordRecoveryLimiter } from "../middleware/rateLimiter.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  changePasswordSchema,
  createAdminSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  requestEmailVerificationSchema,
  resetPasswordSchema,
  revokeSessionSchema,
  verifyEmailSchema
} from "../validators/auth.validator";

const router = Router();
const controller = new AuthController();

router.post("/bootstrap", authLimiter, validate(createAdminSchema), asyncHandler(controller.bootstrap));
router.post("/login", loginLimiter, validate(loginSchema), asyncHandler(controller.login));
router.post("/refresh", authLimiter, validate(refreshTokenSchema), asyncHandler(controller.refresh));
router.post(
  "/forgot-password",
  passwordRecoveryLimiter,
  validate(forgotPasswordSchema),
  asyncHandler(controller.forgotPassword)
);
router.post(
  "/reset-password",
  passwordRecoveryLimiter,
  validate(resetPasswordSchema),
  asyncHandler(controller.resetPassword)
);
router.post(
  "/email-verification/request",
  authLimiter,
  validate(requestEmailVerificationSchema),
  asyncHandler(controller.requestEmailVerification)
);
router.post(
  "/email-verification/verify",
  authLimiter,
  validate(verifyEmailSchema),
  asyncHandler(controller.verifyEmail)
);

router.get("/me", authenticate, asyncHandler(controller.me));
router.post("/logout", authenticate, asyncHandler(controller.logout));
router.post(
  "/change-password",
  authenticate,
  passwordRecoveryLimiter,
  validate(changePasswordSchema),
  asyncHandler(controller.changePassword)
);
router.post(
  "/email-verification/resend",
  authenticate,
  validate(requestEmailVerificationSchema),
  asyncHandler(controller.requestEmailVerification)
);
router.get("/sessions", authenticate, asyncHandler(controller.listSessions));
router.delete("/sessions/:id", authenticate, validate(revokeSessionSchema), asyncHandler(controller.revokeSession));
router.post(
  "/admins",
  authenticate,
  requirePermissions("admins:manage"),
  validate(createAdminSchema),
  asyncHandler(controller.createAdmin)
);

export default router;
