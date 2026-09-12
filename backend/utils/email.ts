
// import { Resend } from "resend";
// import { env } from "../configs/env";

// const resend = new Resend(env.RESEND_API_KEY);

// export const sendEmail = async ({
//   to,
//   subject,
//   html,
// }: {
//   to: string;
//   subject: string;
//   html: string;
// }) => {
//   console.log("📧 Attempting to send email to:", to);

//   try {
//     const { data, error } = await resend.emails.send({
//       from: "Vendora <onboarding@resend.dev>",
//       to: [to],
//       subject,
//       html,
//     });

//     if (error) {
//       console.error("❌ Email sending failed:", error);
//       throw error;
//     }

//     console.log("✅ Email sent:", data?.id);

//     return data;
//   } catch (error) {
//     console.error("❌ Email sending failed:", error);
//     throw error;
//   }
// };

// import nodemailer from "nodemailer";

// import { env } from "../configs/env";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: env.SMTP_USER,
//     pass: env.SMTP_PASS,
//   },
// });
// export const sendEmail = async ({
//   to,
//   subject,
//   html,
// }: {
//   to: string;
//   subject: string;
//   html: string;
// }) => {
//   console.log("📧 Attempting to send email to:", to);

//   try {
//     const info = await transporter.sendMail({
//       from: `"Vendora" <${env.SMTP_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log("✅ Email sent:", info.messageId);

//     return info;
//   } catch (error) {
//     console.error("❌ Email sending failed:", error);
//     throw error;
//   }
// };

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