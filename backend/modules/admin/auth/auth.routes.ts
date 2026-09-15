import {Router} from "express";

import {
  sendAdminVerification,
  resendAdminVerification,
  adminSignup,
  adminLogin,
  adminRefreshToken,
  adminLogout,
  adminForgotPassword,
  resendAdminForgotPassword,
  adminResetPassword,
} from "@/modules/admin/auth/auth.controller";

import {
  admin,
} from "@/middlewares/admin.middleware";
import { superAdmin } from "@/middlewares/superAdmin.middleware";

import { validate } from "@/middlewares/validate.middleware";

import {
  sendAdminVerificationSchema,
  resendAdminVerificationSchema,
  adminSignupSchema,
  adminLoginSchema,
  forgotPasswordSchema,
  resendForgotPasswordTokenSchema,
  resetPasswordSchema,
} from "@/modules/admin/auth/auth.validation";
import { authRateLimiter } from "@/middlewares/rateLimit.middleware";

const router = Router();

router.post(
  "/send-verification-token",
  admin,
  superAdmin, authRateLimiter,
  validate({
    body: sendAdminVerificationSchema,
  }),
  sendAdminVerification
);

router.post(
  "/resend-verification-token",
  admin,
  superAdmin,authRateLimiter,
  validate({
    body: resendAdminVerificationSchema,
  }),
  resendAdminVerification
);


router.post(
  "/resend-forgot-password-token",
  admin,
  superAdmin, authRateLimiter,
  validate({
    body:
      resendForgotPasswordTokenSchema,
  }),
  resendAdminForgotPassword
);


router.post(
  "/signup", authRateLimiter,
  validate({
    body: adminSignupSchema,
  }),
  adminSignup
);


router.post(
  "/login", authRateLimiter,
  validate({
    body: adminLoginSchema,
  }),
  adminLogin
);

router.post(
  "/refresh-token",
  adminRefreshToken
);


router.post(
  "/logout",
  adminLogout
);

router.post(
  "/forgot-password",
  admin,
  superAdmin, authRateLimiter,
  validate({
    body: forgotPasswordSchema,
  }),
  adminForgotPassword
);


router.post(
  "/reset-password", authRateLimiter,
  validate({
    body: resetPasswordSchema,
  }),
  adminResetPassword
);

export default router;