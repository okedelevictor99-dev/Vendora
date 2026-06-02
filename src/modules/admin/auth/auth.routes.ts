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
} from "./auth.controller";

import {
  admin,
} from "../../../middlewares/admin.middleware";
import { superAdmin } from "../../../middlewares/superAdmin.middleware";

import { validate } from "../../../middlewares/validate.middleware";

import {
  sendAdminVerificationSchema,
  resendAdminVerificationSchema,
  adminSignupSchema,
  adminLoginSchema,
  forgotPasswordSchema,
  resendForgotPasswordTokenSchema,
  resetPasswordSchema,
} from "./auth.validation";

const router = Router();

/* =========================
   SUPERADMIN ROUTES
========================= */

// send admin invite
router.post(
  "/send-verification",
  admin,
  superAdmin,
  validate({
    body: sendAdminVerificationSchema,
  }),
  sendAdminVerification
);

// resend invite token
router.post(
  "/resend-verification",
  admin,
  superAdmin,
  validate({
    body: resendAdminVerificationSchema,
  }),
  resendAdminVerification
);

// resend forgot password token
router.post(
  "/resend-forgot-password-token",
  admin,
  superAdmin,
  validate({
    body:
      resendForgotPasswordTokenSchema,
  }),
  resendAdminForgotPassword
);

/* =========================
   PUBLIC ADMIN ROUTES
========================= */

// signup after invite
router.post(
  "/signup",
  validate({
    body: adminSignupSchema,
  }),
  adminSignup
);

// login
router.post(
  "/login",
  validate({
    body: adminLoginSchema,
  }),
  adminLogin
);

// refresh token
router.post(
  "/refresh-token",
  adminRefreshToken
);

// logout
router.post(
  "/logout",
  adminLogout
);

// forgot password
router.post(
  "/forgot-password",
  validate({
    body: forgotPasswordSchema,
  }),
  adminForgotPassword
);

// reset password
router.post(
  "/reset-password",
  validate({
    body: resetPasswordSchema,
  }),
  adminResetPassword
);

export default router;