import crypto from "crypto";

export function generateOpaqueToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function hashOpaqueToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
