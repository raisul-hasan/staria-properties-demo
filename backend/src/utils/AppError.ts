import { ErrorCode, ErrorCodes, FieldError, statusToErrorCode } from "../core/errorCodes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: ErrorCode;
  public readonly errors?: FieldError[];

  constructor(
    message: string,
    statusCode = 500,
    options?: {
      isOperational?: boolean;
      code?: ErrorCode;
      errors?: FieldError[];
    }
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? true;
    this.code = options?.code ?? statusToErrorCode(statusCode);
    this.errors = options?.errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: FieldError[]) {
    return new AppError(message, 400, { code: ErrorCodes.VALIDATION_FAILED, errors });
  }

  static unauthorized(message = "Authentication required") {
    return new AppError(message, 401, { code: ErrorCodes.UNAUTHORIZED });
  }

  static forbidden(message = "Insufficient permissions") {
    return new AppError(message, 403, { code: ErrorCodes.FORBIDDEN });
  }

  static notFound(message = "Resource not found") {
    return new AppError(message, 404, { code: ErrorCodes.NOT_FOUND });
  }

  static conflict(message: string) {
    return new AppError(message, 409, { code: ErrorCodes.CONFLICT });
  }

  static locked(message = "Account is temporarily locked") {
    return new AppError(message, 423, { code: ErrorCodes.ACCOUNT_LOCKED });
  }

  static tooManyRequests(message = "Too many requests") {
    return new AppError(message, 429, { code: ErrorCodes.RATE_LIMITED });
  }
}
