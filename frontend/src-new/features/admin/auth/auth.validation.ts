import { z } from "zod";

import {
  emailSchema,
  passwordSchema,
  tokenSchema,
} from "@/features/client/auth/auth.validation";

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50);

export const sendAdminVerificationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});

export const resendAdminVerificationSchema = z.object({
  email: emailSchema,
});

export const adminSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  token: tokenSchema,
});

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resendForgotPasswordTokenSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  token: tokenSchema,
  newPassword: passwordSchema,
});

export type SendAdminVerificationFormValues = z.infer<typeof sendAdminVerificationSchema>;
export type ResendAdminVerificationFormValues = z.infer<typeof resendAdminVerificationSchema>;
export type AdminSignupFormValues = z.infer<typeof adminSignupSchema>;
export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
export type AdminForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type AdminResendForgotPasswordTokenFormValues = z.infer<typeof resendForgotPasswordTokenSchema>;
export type AdminResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;