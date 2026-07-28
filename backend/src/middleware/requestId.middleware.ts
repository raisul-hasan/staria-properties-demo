import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

const REQUEST_ID_HEADER = "x-request-id";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.get(REQUEST_ID_HEADER);
  const requestId = incoming?.trim() || randomUUID();

  req.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);
  next();
}
