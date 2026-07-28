import { sendMail } from "../config/mail";

export async function sendWelcomeEmail(to: string, name: string) {
  return sendMail({
    to,
    subject: "Welcome to Staria Properties",
    text: `Hello ${name},\n\nWelcome to Staria Properties.`,
    html: `<p>Hello <strong>${name}</strong>,</p><p>Welcome to Staria Properties.</p>`
  });
}
