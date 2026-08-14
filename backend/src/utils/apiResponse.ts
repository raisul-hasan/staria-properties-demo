import { Response } from "express";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export function sendSuccess<T>(res: Response, statusCode: number, message: string, data?: T) {
  const payload: ApiResponse<T> = {
    success: true,
    message
  };

  if (data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
}

export function sendError(res: Response, statusCode: number, message: string) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}
