import { env } from "../config/env";
import { AppError } from "./AppError";

type SpamInput = {
  email?: string;
  name?: string;
  subject?: string | null;
  message?: string | null;
  honeypot?: string | null;
  recaptchaToken?: string | null;
  expectedAction?: string;
  ipAddress?: string;
};

export type SpamAssessment = {
  isSpam: boolean;
  spamScore: number;
  spamReason?: string;
  recaptchaScore?: number;
  recaptchaAction?: string;
};

type RecaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  challenge_ts?: string;
  "error-codes"?: string[];
};

export async function assessSubmission(input: SpamInput): Promise<SpamAssessment> {
  const reasons: string[] = [];
  let spamScore = 0;

  if (input.honeypot?.trim()) {
    spamScore += 100;
    reasons.push("honeypot");
  }

  const content = [input.name, input.subject, input.message].filter(Boolean).join(" ");
  const linkCount = (content.match(/https?:\/\//gi) ?? []).length;
  if (linkCount >= 3) {
    spamScore += 35;
    reasons.push("too_many_links");
  }

  if (/(crypto|casino|loan|viagra|forex|betting)/i.test(content)) {
    spamScore += 25;
    reasons.push("spam_keywords");
  }

  if (/(.)\1{12,}/.test(content)) {
    spamScore += 15;
    reasons.push("repeated_characters");
  }

  const recaptcha = await verifyRecaptcha(input.recaptchaToken, input.ipAddress);
  if (recaptcha) {
    if (!recaptcha.success) {
      spamScore += 60;
      reasons.push("recaptcha_failed");
    }

    if (typeof recaptcha.score === "number" && recaptcha.score < env.RECAPTCHA_MIN_SCORE) {
      spamScore += Math.round((env.RECAPTCHA_MIN_SCORE - recaptcha.score) * 100);
      reasons.push("recaptcha_low_score");
    }

    if (input.expectedAction && recaptcha.action && recaptcha.action !== input.expectedAction) {
      spamScore += 30;
      reasons.push("recaptcha_action_mismatch");
    }
  }

  return {
    isSpam: spamScore >= 60,
    spamScore,
    spamReason: reasons.length ? reasons.join(",") : undefined,
    recaptchaScore: recaptcha?.score,
    recaptchaAction: recaptcha?.action
  };
}

async function verifyRecaptcha(token?: string | null, ipAddress?: string) {
  if (!env.RECAPTCHA_SECRET_KEY) {
    if (env.RECAPTCHA_REQUIRED) {
      throw new AppError("reCAPTCHA is required", 400);
    }
    return null;
  }

  if (!token) {
    throw new AppError("reCAPTCHA token is required", 400);
  }

  const params = new URLSearchParams({
    secret: env.RECAPTCHA_SECRET_KEY,
    response: token
  });

  if (ipAddress) {
    params.set("remoteip", ipAddress);
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  if (!response.ok) {
    throw new AppError("Could not verify reCAPTCHA", 502);
  }

  return (await response.json()) as RecaptchaResponse;
}
