import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ErrorCodes } from "../core/errorCodes";
import { AppError } from "../utils/AppError";

function formatZodErrors(error: ZodError) {
  return error.errors.map((issue) => ({
    field: issue.path.slice(1).join(".") || issue.path.join("."),
    message: issue.message,
    code: issue.code
  }));
}

export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!parsed.success) {
      const errors = formatZodErrors(parsed.error);
      const message = errors.map((issue) => issue.message).join(", ");
      next(
        new AppError(message || "Validation failed", 400, {
          code: ErrorCodes.VALIDATION_FAILED,
          errors
        })
      );
      return;
    }

    req.body = parsed.data.body ?? req.body;
    req.params = parsed.data.params ?? req.params;
    req.query = parsed.data.query ?? req.query;
    next();
  };
}

export function mergeSchemas(...schemas: AnyZodObject[]) {
  return schemas.reduce((acc, schema) => acc.merge(schema));
}
