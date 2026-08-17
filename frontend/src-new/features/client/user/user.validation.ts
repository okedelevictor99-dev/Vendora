import { z } from "zod";

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50);

const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase();

const passwordSchema = z
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

export const changeNameSchema = z.object({
  name: nameSchema,
});

export const changeEmailSchema = z.object({
  currentPassword: z.string().min(1, "Password is required"),
  newEmail: emailSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

export const verifyChangeEmailSchema = z.object({
  email: emailSchema,
  token: tokenSchema,
});

export type ChangeNameFormValues = z.infer<typeof changeNameSchema>;
export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type VerifyChangeEmailFormValues = z.infer<typeof verifyChangeEmailSchema>;