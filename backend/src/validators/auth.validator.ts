import { z } from "zod";
import { emailSchema } from "./shared";

export const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

export const createAdminSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: emailSchema,
    password: passwordSchema,
    roleSlugs: z.array(z.string().trim().min(2).max(100)).min(1).default(["content-editor"]),
    sendVerificationEmail: z.boolean().default(true)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required")
  })
});

export const refreshTokenSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(1).optional()
    })
    .default({})
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(32, "Reset token is invalid"),
    password: passwordSchema
  })
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: passwordSchema,
      confirmPassword: z.string().min(1, "Please confirm the new password")
    })
    .refine((input) => input.newPassword === input.confirmPassword, {
      message: "New password and confirmation do not match",
      path: ["confirmPassword"]
    })
    .refine((input) => input.currentPassword !== input.newPassword, {
      message: "New password must be different from the current password",
      path: ["newPassword"]
    })
});

export const requestEmailVerificationSchema = z.object({
  body: z
    .object({
      email: emailSchema.optional()
    })
    .default({})
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(32, "Verification token is invalid")
  })
});

export const revokeSessionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Session id is invalid")
  })
});
