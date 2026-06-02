import { z } from "zod";

/* =========================
   🔐 Reusable Schemas
========================= */

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase, and number"
  );


export const tokenSchema = z
  .string()
  .length(6, "Code must be 6 digits")
  .regex(/^\d{6}$/, "Code must contain only digits");

/* =========================
   🧾 AUTH SCHEMAS
========================= */

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export const verifyEmailSchema = z
  .object({
    email: emailSchema,
    token: tokenSchema,
  })
  .strict();

export const resendVerificationTokenSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const resendForgotPasswordTokenSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    token: tokenSchema,
    newPassword: passwordSchema,
  })
  .strict();
 