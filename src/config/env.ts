import dotenv from 'dotenv';
import { z } from 'zod';
import {StringValue} from "ms"

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1),

  CLIENT_URL: z.string().url(),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  SUPER_ADMIN_NAME: z
  .string()
  .min(2, "SUPER_ADMIN_NAME is required"),

  SUPER_ADMIN_EMAIL: z
  .string()
  .email("Invalid SUPER_ADMIN_EMAIL"),

  SUPER_ADMIN_PASSWORD: z
  .string()
  .min(
    8,
    "SUPER_ADMIN_PASSWORD must be at least 8 characters"
  ),
  PAYSTACK_SECRET_KEY: z.string().min(1),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('debug'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;