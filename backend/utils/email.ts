
import { Resend } from "resend";
import { env } from "../configs/env";

const resend = new Resend(env.RESEND_API_KEY);

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
    const { data, error } = await resend.emails.send({
      from: "Vendora <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("❌ Email sending failed:", error);
      throw error;
    }

    console.log("✅ Email sent:", data?.id);

    return data;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};