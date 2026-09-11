import nodemailer from 'nodemailer';
import { env } from '../configs/env';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP verification failed:', error);
  } else {
    console.log('✅ SMTP server is ready:', success);
  }
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
  console.log('📧 Attempting to send email to:', to);

  try {
    const result = await transporter.sendMail({
      from: `"Your App" <${env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', result.messageId);

    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};


