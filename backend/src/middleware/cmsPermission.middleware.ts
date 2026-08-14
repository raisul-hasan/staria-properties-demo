import { NextFunction, Request, Response } from "express";
import { getCmsResourceConfig } from "../config/cmsResources";
import { AppError } from "../utils/AppError";
import { hasPermission } from "./auth.middleware";

export function requireCmsPermission(action: "read" | "create" | "update" | "delete") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Authentication token is required", 401));
      return;
    }

    const resourceName = String(req.params.resource);
    const config = getCmsResourceConfig(resourceName);
    if (!config) {
      next(new AppError(`Unsupported CMS resource: ${resourceName}`, 404));
      return;
    }

    const permissions = [
      `${config.permissionResource}:${action}`,
      `${config.permissionResource}:manage`,
      "content:manage"
    ];

    if (!permissions.some((permission) => hasPermission(req.user!.permissions, permission))) {
      next(new AppError("You do not have permission to perform this action", 403));
      return;
    }

    next();
  };
}
