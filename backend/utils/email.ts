// import nodemailer from 'nodemailer';
// import { env } from '../configs/env';

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: env.SMTP_USER,
//     pass: env.SMTP_PASS,
//   },
//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 10000,
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error('❌ SMTP verification failed:', error);
//   } else {
//     console.log('✅ SMTP server is ready:', success);
//   }
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
//   console.log('📧 Attempting to send email to:', to);

//   try {
//     const result = await transporter.sendMail({
//       from: `"Your App" <${env.SMTP_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log('✅ Email sent:', result.messageId);

//     return result;
//   } catch (error) {
//     console.error('❌ Email sending failed:', error);
//     throw error;
//   }
// };


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
      from: "My App <onboarding@resend.dev>",
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