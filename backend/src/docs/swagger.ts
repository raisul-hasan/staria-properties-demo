import { env } from "../config/env";
import { cmsResourceNames } from "../config/cmsResources";
import { getZodOpenApiComponents } from "./openapi/zodComponents";

const apiResponse = {
  "application/json": {
    schema: { $ref: "#/components/schemas/ApiSuccess" }
  }
};

const errorResponse = {
  "application/json": {
    schema: { $ref: "#/components/schemas/ApiError" }
  }
};

const zodComponents = getZodOpenApiComponents();

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Staria Properties API",
    version: "1.0.0",
    description:
      "Enterprise REST API for Staria Properties real-estate listings, developments, content, enquiries and administration. All versioned routes are served under /api/v1."
  },
  servers: [{ url: env.API_PREFIX, description: "Current API version" }],
  paths: {
      "/site": {
        get: {
          tags: ["Site"],
          summary: "Get public website metadata",
          responses: {
            "200": { description: "Site metadata retrieved", content: apiResponse },
            "429": { description: "Rate limit exceeded", content: errorResponse }
          }
        }
      },
      "/auth/bootstrap": {
        post: {
          tags: ["Auth"],
          summary: "Create the first Owner admin when registration is enabled and no admins exist",
          requestBody: { $ref: "#/components/requestBodies/CreateAdmin" },
          responses: {
            "201": { description: "Owner admin bootstrapped", content: apiResponse },
            "403": { description: "Bootstrap disabled", content: errorResponse }
          }
        }
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Admin login with lockout protection and HTTP-only cookie issuance",
          requestBody: { $ref: "#/components/requestBodies/Login" },
          responses: {
            "200": { description: "Admin login successful", content: apiResponse },
            "401": { description: "Invalid credentials", content: errorResponse },
            "423": { description: "Account locked", content: errorResponse }
          }
        }
      },
      "/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Rotate refresh token and issue a new access token",
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refreshToken: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Token refreshed", content: apiResponse },
            "401": { description: "Refresh token invalid or expired", content: errorResponse }
          }
        }
      },
      "/auth/forgot-password": {
        post: {
          tags: ["Auth"],
          summary: "Request an admin password reset email",
          requestBody: { $ref: "#/components/requestBodies/ForgotPassword" },
          responses: {
            "200": { description: "Password reset request accepted", content: apiResponse }
          }
        }
      },
      "/auth/reset-password": {
        post: {
          tags: ["Auth"],
          summary: "Reset admin password and revoke active sessions",
          requestBody: { $ref: "#/components/requestBodies/ResetPassword" },
          responses: {
            "200": { description: "Password reset successfully", content: apiResponse },
            "400": { description: "Reset token invalid or expired", content: errorResponse }
          }
        }
      },
      "/auth/change-password": {
        post: {
          tags: ["Auth"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Change the authenticated admin password and revoke all sessions",
          requestBody: { $ref: "#/components/requestBodies/ChangePassword" },
          responses: {
            "200": { description: "Password changed; sign in again", content: apiResponse },
            "400": { description: "Current password or new password is invalid", content: errorResponse },
            "401": { description: "Authentication required", content: errorResponse }
          }
        }
      },
      "/auth/email-verification/request": {
        post: {
          tags: ["Auth"],
          summary: "Request an email verification message by admin email",
          requestBody: { $ref: "#/components/requestBodies/EmailVerificationRequest" },
          responses: {
            "200": { description: "Verification request accepted", content: apiResponse }
          }
        }
      },
      "/auth/email-verification/verify": {
        post: {
          tags: ["Auth"],
          summary: "Verify an admin email address",
          requestBody: { $ref: "#/components/requestBodies/VerifyEmail" },
          responses: {
            "200": { description: "Email verified", content: apiResponse },
            "400": { description: "Verification token invalid or expired", content: errorResponse }
          }
        }
      },
      "/auth/me": {
        get: {
          tags: ["Auth"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Get current authenticated admin profile",
          responses: {
            "200": { description: "Admin profile retrieved", content: apiResponse },
            "401": { description: "Authentication required", content: errorResponse }
          }
        }
      },
      "/auth/logout": {
        post: {
          tags: ["Auth"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Revoke current admin session and clear auth cookies",
          responses: {
            "200": { description: "Logout successful", content: apiResponse }
          }
        }
      },
      "/auth/email-verification/resend": {
        post: {
          tags: ["Auth"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Resend verification email for the authenticated admin",
          responses: {
            "200": { description: "Verification request accepted", content: apiResponse }
          }
        }
      },
      "/auth/sessions": {
        get: {
          tags: ["Sessions"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "List active sessions for the current admin",
          responses: {
            "200": { description: "Sessions retrieved", content: apiResponse }
          }
        }
      },
      "/auth/sessions/{id}": {
        delete: {
          tags: ["Sessions"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Revoke one active session for the current admin",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            "200": { description: "Session revoked", content: apiResponse },
            "404": { description: "Session not found", content: errorResponse }
          }
        }
      },
      "/auth/admins": {
        post: {
          tags: ["Admin Users"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Create an admin user with one or more roles",
          requestBody: { $ref: "#/components/requestBodies/CreateAdmin" },
          responses: {
            "201": { description: "Admin user created", content: apiResponse },
            "403": { description: "Requires admins:manage permission", content: errorResponse }
          }
        }
      },
      "/admin/cms/media/images": {
        post: {
          tags: ["CMS Media"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Upload an image to Cloudinary and store its URL metadata",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["image"],
                  properties: {
                    image: { type: "string", format: "binary" },
                    altText: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Image uploaded", content: apiResponse },
            "403": { description: "Requires media:upload permission", content: errorResponse }
          }
        }
      },
      "/admin/cms/media": {
        get: {
          tags: ["CMS Media"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Browse and search the media library",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 24, maximum: 100 } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "resourceType", in: "query", schema: { type: "string", enum: ["IMAGE", "VIDEO", "PDF", "RAW"] } }
          ],
          responses: {
            "200": { description: "Media assets retrieved", content: apiResponse },
            "403": { description: "Requires media:read permission", content: errorResponse }
          }
        }
      },
      "/admin/cms/media/files": {
        post: {
          tags: ["CMS Media"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Upload an image or PDF to Cloudinary and store its URL metadata",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file"],
                  properties: {
                    file: { type: "string", format: "binary" },
                    altText: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "File uploaded", content: apiResponse },
            "403": { description: "Requires media:upload permission", content: errorResponse }
          }
        }
      },
      "/admin/cms/{resource}": {
        get: {
          tags: ["CMS"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "List CMS records with pagination, filtering, sorting and search",
          parameters: [
            { $ref: "#/components/parameters/CmsResource" },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string", example: "PUBLISHED" } },
            { name: "sortBy", in: "query", schema: { type: "string" } },
            { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
            { name: "includeDeleted", in: "query", schema: { type: "boolean" } },
            { name: "deletedOnly", in: "query", schema: { type: "boolean" } },
            { name: "categoryId", in: "query", schema: { type: "string", format: "uuid" } },
            { name: "categoryType", in: "query", schema: { type: "string" } },
            { name: "isFeatured", in: "query", schema: { type: "boolean" } }
          ],
          responses: {
            "200": { description: "CMS records retrieved", content: apiResponse },
            "403": { description: "Missing read permission", content: errorResponse }
          }
        },
        post: {
          tags: ["CMS"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Create a CMS record",
          parameters: [{ $ref: "#/components/parameters/CmsResource" }],
          requestBody: { $ref: "#/components/requestBodies/CmsMutation" },
          responses: {
            "201": { description: "CMS record created", content: apiResponse },
            "400": { description: "Validation failed", content: errorResponse },
            "403": { description: "Missing create permission", content: errorResponse }
          }
        }
      },
      "/admin/cms/{resource}/{id}": {
        get: {
          tags: ["CMS"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Get one CMS record",
          parameters: [{ $ref: "#/components/parameters/CmsResource" }, { $ref: "#/components/parameters/Uuid" }],
          responses: {
            "200": { description: "CMS record retrieved", content: apiResponse },
            "404": { description: "Record not found", content: errorResponse }
          }
        },
        patch: {
          tags: ["CMS"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Update a CMS record",
          parameters: [{ $ref: "#/components/parameters/CmsResource" }, { $ref: "#/components/parameters/Uuid" }],
          requestBody: { $ref: "#/components/requestBodies/CmsMutation" },
          responses: {
            "200": { description: "CMS record updated", content: apiResponse },
            "400": { description: "Validation failed", content: errorResponse },
            "404": { description: "Record not found", content: errorResponse }
          }
        },
        delete: {
          tags: ["CMS"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Soft-delete a CMS record",
          parameters: [{ $ref: "#/components/parameters/CmsResource" }, { $ref: "#/components/parameters/Uuid" }],
          responses: {
            "200": { description: "CMS record soft-deleted", content: apiResponse },
            "404": { description: "Record not found", content: errorResponse }
          }
        }
      },
      "/admin/cms/{resource}/{id}/publish": {
        patch: {
          tags: ["CMS"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Publish a draft CMS record",
          parameters: [{ $ref: "#/components/parameters/CmsResource" }, { $ref: "#/components/parameters/Uuid" }],
          responses: { "200": { description: "CMS record published", content: apiResponse } }
        }
      },
      "/admin/cms/{resource}/{id}/draft": {
        patch: {
          tags: ["CMS"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Move a CMS record to draft",
          parameters: [{ $ref: "#/components/parameters/CmsResource" }, { $ref: "#/components/parameters/Uuid" }],
          responses: { "200": { description: "CMS record moved to draft", content: apiResponse } }
        }
      },
      "/admin/cms/{resource}/{id}/restore": {
        patch: {
          tags: ["CMS"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Restore a soft-deleted CMS record",
          parameters: [{ $ref: "#/components/parameters/CmsResource" }, { $ref: "#/components/parameters/Uuid" }],
          responses: { "200": { description: "CMS record restored", content: apiResponse } }
        }
      },
      "/quotations": {
        post: {
          tags: ["RFQ"],
          summary: "Submit a customer request for quotation",
          requestBody: { $ref: "#/components/requestBodies/CreateQuotation" },
          responses: {
            "201": { description: "Quotation request submitted", content: apiResponse },
            "400": { description: "Validation failed", content: errorResponse }
          }
        }
      },
      "/admin/quotations": {
        get: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "List quotations with CRM filters, search, sorting and pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "IN_REVIEW", "QUOTED", "REJECTED", "COMPLETED"] } },
            { name: "assignedToId", in: "query", schema: { type: "string", format: "uuid" } },
            { name: "email", in: "query", schema: { type: "string" } },
            { name: "country", in: "query", schema: { type: "string" } },
            { name: "createdFrom", in: "query", schema: { type: "string", format: "date-time" } },
            { name: "createdTo", in: "query", schema: { type: "string", format: "date-time" } },
            { name: "sortBy", in: "query", schema: { type: "string", enum: ["createdAt", "updatedAt", "lastActivityAt", "requestNo", "status", "companyName"] } },
            { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"] } }
          ],
          responses: {
            "200": { description: "Quotations retrieved", content: apiResponse },
            "403": { description: "Requires quotations:read", content: errorResponse }
          }
        }
      },
      "/admin/quotations/export.csv": {
        get: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Export filtered quotations as CSV",
          responses: {
            "200": { description: "CSV file", content: { "text/csv": { schema: { type: "string" } } } },
            "403": { description: "Requires quotations:export", content: errorResponse }
          }
        }
      },
      "/admin/quotations/stats": {
        get: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Get quotation status counts",
          responses: { "200": { description: "Quotation statistics retrieved", content: apiResponse } }
        }
      },
      "/admin/quotations/sales-executives": {
        get: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "List admins eligible for quotation assignment",
          responses: { "200": { description: "Sales executives retrieved", content: apiResponse } }
        }
      },
      "/admin/quotations/{id}": {
        get: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Get quotation detail with items and conversation history",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          responses: { "200": { description: "Quotation retrieved", content: apiResponse } }
        },
        patch: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Update CRM fields on a quotation",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          requestBody: { $ref: "#/components/requestBodies/UpdateQuotation" },
          responses: { "200": { description: "Quotation updated", content: apiResponse } }
        },
        delete: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Soft-delete a quotation",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          responses: { "200": { description: "Quotation deleted", content: apiResponse } }
        }
      },
      "/admin/quotations/{id}/assign": {
        patch: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Assign or unassign a Sales Executive",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          requestBody: { $ref: "#/components/requestBodies/AssignQuotation" },
          responses: { "200": { description: "Quotation assigned", content: apiResponse } }
        }
      },
      "/admin/quotations/{id}/status": {
        patch: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Change quotation status",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          requestBody: { $ref: "#/components/requestBodies/QuotationStatus" },
          responses: { "200": { description: "Quotation status updated", content: apiResponse } }
        }
      },
      "/admin/quotations/{id}/conversations": {
        get: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "List quotation conversation history",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          responses: { "200": { description: "Conversations retrieved", content: apiResponse } }
        },
        post: {
          tags: ["RFQ Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Add message or internal note to quotation conversation",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          requestBody: { $ref: "#/components/requestBodies/QuotationConversation" },
          responses: { "201": { description: "Conversation entry added", content: apiResponse } }
        }
      },
      "/contact": {
        post: {
          tags: ["Forms"],
          summary: "Submit the public contact form with spam and reCAPTCHA protection",
          requestBody: { $ref: "#/components/requestBodies/ContactSubmission" },
          responses: {
            "201": { description: "Contact form submitted", content: apiResponse },
            "400": { description: "Validation or reCAPTCHA failed", content: errorResponse }
          }
        }
      },
      "/newsletter/subscribe": {
        post: {
          tags: ["Forms"],
          summary: "Subscribe to the newsletter with spam and reCAPTCHA protection",
          requestBody: { $ref: "#/components/requestBodies/NewsletterSubscription" },
          responses: {
            "201": { description: "Newsletter subscription saved", content: apiResponse },
            "400": { description: "Validation or reCAPTCHA failed", content: errorResponse }
          }
        }
      },
      "/admin/contact-submissions": {
        get: {
          tags: ["Contact Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "List contact submissions with filtering, search, sorting and pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string", enum: ["NEW", "ASSIGNED", "RESPONDED", "CLOSED", "SPAM"] } },
            { name: "assignedToId", in: "query", schema: { type: "string", format: "uuid" } },
            { name: "email", in: "query", schema: { type: "string" } },
            { name: "source", in: "query", schema: { type: "string" } },
            { name: "isSpam", in: "query", schema: { type: "boolean" } },
            { name: "sortBy", in: "query", schema: { type: "string", enum: ["createdAt", "updatedAt", "fullName", "email", "status", "spamScore"] } },
            { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"] } }
          ],
          responses: {
            "200": { description: "Contact submissions retrieved", content: apiResponse },
            "403": { description: "Requires contact:read", content: errorResponse }
          }
        }
      },
      "/admin/contact-submissions/stats": {
        get: {
          tags: ["Contact Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Get contact submission status counts",
          responses: { "200": { description: "Contact statistics retrieved", content: apiResponse } }
        }
      },
      "/admin/contact-submissions/{id}": {
        get: {
          tags: ["Contact Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Get one contact submission",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          responses: { "200": { description: "Contact submission retrieved", content: apiResponse } }
        },
        patch: {
          tags: ["Contact Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Update contact submission status, assignment or notes",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          requestBody: { $ref: "#/components/requestBodies/UpdateContactSubmission" },
          responses: { "200": { description: "Contact submission updated", content: apiResponse } }
        },
        delete: {
          tags: ["Contact Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Soft-delete a contact submission",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          responses: { "200": { description: "Contact submission deleted", content: apiResponse } }
        }
      },
      "/admin/newsletter-subscribers": {
        get: {
          tags: ["Newsletter Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "List newsletter subscribers with filtering, search, sorting and pagination",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string", enum: ["SUBSCRIBED", "UNSUBSCRIBED", "BOUNCED", "SPAM"] } },
            { name: "email", in: "query", schema: { type: "string" } },
            { name: "source", in: "query", schema: { type: "string" } },
            { name: "isSpam", in: "query", schema: { type: "boolean" } },
            { name: "sortBy", in: "query", schema: { type: "string", enum: ["createdAt", "updatedAt", "subscribedAt", "email", "status", "spamScore"] } },
            { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"] } }
          ],
          responses: {
            "200": { description: "Newsletter subscribers retrieved", content: apiResponse },
            "403": { description: "Requires newsletter:read", content: errorResponse }
          }
        }
      },
      "/admin/newsletter-subscribers/stats": {
        get: {
          tags: ["Newsletter Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Get newsletter subscriber status counts",
          responses: { "200": { description: "Newsletter statistics retrieved", content: apiResponse } }
        }
      },
      "/admin/newsletter-subscribers/{id}": {
        get: {
          tags: ["Newsletter Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Get one newsletter subscriber",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          responses: { "200": { description: "Newsletter subscriber retrieved", content: apiResponse } }
        },
        patch: {
          tags: ["Newsletter Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Update newsletter subscriber status or metadata",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          requestBody: { $ref: "#/components/requestBodies/UpdateNewsletterSubscriber" },
          responses: { "200": { description: "Newsletter subscriber updated", content: apiResponse } }
        },
        delete: {
          tags: ["Newsletter Admin"],
          security: [{ bearerAuth: [] }, { accessCookie: [] }],
          summary: "Soft-delete a newsletter subscriber",
          parameters: [{ $ref: "#/components/parameters/Uuid" }],
          responses: { "200": { description: "Newsletter subscriber deleted", content: apiResponse } }
        }
      }
    },
    components: {
      ...(zodComponents as Record<string, unknown>),
      parameters: {
        CmsResource: {
          name: "resource",
          in: "path",
          required: true,
          schema: {
            type: "string",
            enum: cmsResourceNames
          }
        },
        Uuid: {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        },
        accessCookie: {
          type: "apiKey",
          in: "cookie",
          name: env.ACCESS_TOKEN_COOKIE_NAME
        }
      },
      requestBodies: {
        Login: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        CreateAdmin: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAdminRequest" }
            }
          }
        },
        ForgotPassword: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ForgotPasswordRequest" }
            }
          }
        },
        ResetPassword: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ResetPasswordRequest" }
            }
          }
        },
        ChangePassword: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChangePasswordRequest" }
            }
          }
        },
        EmailVerificationRequest: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EmailVerificationRequest" }
            }
          }
        },
        VerifyEmail: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VerifyEmailRequest" }
            }
          }
        },
        CreateQuotation: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateQuotationRequest" }
            }
          }
        },
        UpdateQuotation: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateQuotationRequest" }
            }
          }
        },
        AssignQuotation: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AssignQuotationRequest" }
            }
          }
        },
        QuotationStatus: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/QuotationStatusRequest" }
            }
          }
        },
        QuotationConversation: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/QuotationConversationRequest" }
            }
          }
        },
        ContactSubmission: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactSubmissionRequest" }
            }
          }
        },
        NewsletterSubscription: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/NewsletterSubscriptionRequest" }
            }
          }
        },
        UpdateContactSubmission: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateContactSubmissionRequest" }
            }
          }
        },
        UpdateNewsletterSubscriber: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateNewsletterSubscriberRequest" }
            }
          }
        },
        CmsMutation: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
                description:
                  "Resource-specific payload. Most content resources accept status, media arrays, seo, and relation IDs such as categoryId/categoryIds."
              }
            }
          }
        }
      }
    }
  };


