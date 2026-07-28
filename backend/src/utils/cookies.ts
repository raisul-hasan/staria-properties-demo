import { CookieOptions, Request } from "express";
import { env } from "../config/env";

export function readCookie(req: Request, name: string) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  if (!match) return undefined;

  return decodeURIComponent(match.slice(name.length + 1));
}

export function authCookieOptions(maxAge: number, path = "/"): CookieOptions {
  return {
    httpOnly: true,
    secure: env.JWT_COOKIE_SECURE || env.NODE_ENV === "production",
    sameSite: env.COOKIE_SAME_SITE,
    domain: env.COOKIE_DOMAIN || undefined,
    path,
    maxAge
  };
}

export function clearAuthCookieOptions(path = "/"): CookieOptions {
  return {
    httpOnly: true,
    secure: env.JWT_COOKIE_SECURE || env.NODE_ENV === "production",
    sameSite: env.COOKIE_SAME_SITE,
    domain: env.COOKIE_DOMAIN || undefined,
    path
  };
}
