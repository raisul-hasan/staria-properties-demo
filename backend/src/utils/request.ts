import { Request } from "express";
import { AppError } from "./AppError";

export function getRouteParam(req: Request, key: string) {
  const value = req.params[key];

  if (typeof value !== "string" || !value) {
    throw new AppError(`Route parameter "${key}" is required`, 400);
  }

  return value;
}
