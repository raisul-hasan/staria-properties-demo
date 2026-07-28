import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { apiErrorSchema, apiSuccessSchema, fieldErrorSchema, responseMetaSchema } from "../../core/apiSchemas";
import {
  changePasswordSchema,
  createAdminSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  requestEmailVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema
} from "../../validators/auth.validator";
import {
  contactSubmissionSchema,
  newsletterSubscriptionSchema,
  updateContactStatusSchema,
  updateNewsletterStatusSchema
} from "../../validators/form.validator";
import {
  addQuotationConversationSchema,
  assignQuotationSchema,
  createQuotationSchema,
  updateQuotationSchema,
  updateQuotationStatusSchema
} from "../../validators/quotation.validator";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.register("ApiSuccess", apiSuccessSchema(z.unknown()));
registry.register("ApiError", apiErrorSchema);
registry.register("FieldError", fieldErrorSchema);
registry.register("ResponseMeta", responseMetaSchema);
registry.register("LoginRequest", loginSchema.shape.body);
registry.register("CreateAdminRequest", createAdminSchema.shape.body);
registry.register("RefreshTokenRequest", refreshTokenSchema.shape.body);
registry.register("ForgotPasswordRequest", forgotPasswordSchema.shape.body);
registry.register("ResetPasswordRequest", resetPasswordSchema.shape.body);
registry.register("ChangePasswordRequest", changePasswordSchema.shape.body);
registry.register("EmailVerificationRequest", requestEmailVerificationSchema.shape.body);
registry.register("VerifyEmailRequest", verifyEmailSchema.shape.body);
registry.register("ContactSubmissionRequest", contactSubmissionSchema.shape.body);
registry.register("NewsletterSubscriptionRequest", newsletterSubscriptionSchema.shape.body);
registry.register("UpdateContactSubmissionRequest", updateContactStatusSchema.shape.body);
registry.register("UpdateNewsletterSubscriberRequest", updateNewsletterStatusSchema.shape.body);
registry.register("CreateQuotationRequest", createQuotationSchema.shape.body);
registry.register("UpdateQuotationRequest", updateQuotationSchema.shape.body);
registry.register("AssignQuotationRequest", assignQuotationSchema.shape.body);
registry.register("QuotationStatusRequest", updateQuotationStatusSchema.shape.body);
registry.register("QuotationConversationRequest", addQuotationConversationSchema.shape.body);

const generator = new OpenApiGeneratorV3(registry.definitions);

export function getZodOpenApiComponents() {
  return generator.generateComponents().components ?? {};
}
