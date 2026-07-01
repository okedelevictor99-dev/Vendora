import nodemailer from 'nodemailer';
import { env } from '../configs/env';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS, 
  },
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
  return await transporter.sendMail({
    from: `"Your App" <${env.SMTP_FROM || env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};


