import { z } from "zod";


import {
  emailSchema,
  passwordSchema,
  tokenSchema,
} from "@/modules/client/auth/auth.validation";
import { nameSchema } from "@/modules/client/user/user.validation";


export const sendAdminVerificationSchema =
  z
    .object({
      name:nameSchema,

      email: emailSchema,
    })
    .strict();

export const resendAdminVerificationSchema =
  z
    .object({
      email: emailSchema,
    })
    .strict();    
export const adminSignupSchema = z
  .object({
    email: emailSchema,

    password: passwordSchema,

    token: tokenSchema,
  })
  .strict();
export const adminLoginSchema = z
  .object({
    email: emailSchema,

    password: z
      .string()
      .min(
        1,
        "Password is required"
      ),
  })
  .strict();      
export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strict();
  
export const resendForgotPasswordTokenSchema =
  z
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