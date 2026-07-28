import { z } from "zod";

export const fieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string().optional()
});

export const responseMetaSchema = z.object({
  requestId: z.string(),
  timestamp: z.string().datetime(),
  version: z.string()
});

export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema?: T) =>
  z.object({
    success: z.literal(true),
    message: z.string(),
    data: dataSchema ? dataSchema.optional() : z.unknown().optional(),
    meta: responseMetaSchema.optional()
  });

export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  code: z.string(),
  errors: z.array(fieldErrorSchema).optional(),
  meta: responseMetaSchema.optional()
});

export type ApiSuccess<T = unknown> = {
  success: true;
  message: string;
  data?: T;
  meta?: z.infer<typeof responseMetaSchema>;
};

export type ApiError = z.infer<typeof apiErrorSchema>;
