

import { BrevoClient } from "@getbrevo/brevo";
import { env } from "../configs/env";

const brevo = new BrevoClient({
  apiKey: env.BREVO_API_KEY,
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  console.log("📧 Attempting to send email to:", to);

  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Vendora",
        email: "okedelevictor99@gmail.com",
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    });

    console.log("✅ Email sent:", result);
    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};