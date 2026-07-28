import { Request } from "express";

export type RequestMeta = {
  ipAddress?: string;
  userAgent?: string | null;
  requestId?: string;
};

export function getRequestMeta(req: Request): RequestMeta {
  return {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    requestId: req.requestId
  };
}

export function getRequestId(req: Request): string {
  return req.requestId ?? "unknown";
}
