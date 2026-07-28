import nodemailer from "nodemailer";
import { env } from "./env";
import { logger } from "./logger";

export const mailerConfigured = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

export const transporter = mailerConfigured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    })
  : null;

export async function sendMail(options: { to: string | string[]; subject: string; html: string; text?: string }) {
  if (!transporter) {
    logger.warn("Nodemailer is not configured. Skipping outbound email.", { subject: options.subject });
    return null;
  }

  return transporter.sendMail({
    from: env.SMTP_FROM,
    ...options
  });
}
