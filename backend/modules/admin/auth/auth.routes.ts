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

router.post(
  "/send-verification-token",
  admin,
  superAdmin,
  validate({
    body: sendAdminVerificationSchema,
  }),
  sendAdminVerification
);

router.post(
  "/resend-verification-token",
  admin,
  superAdmin,
  validate({
    body: resendAdminVerificationSchema,
  }),
  resendAdminVerification
);


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


router.post(
  "/signup",
  validate({
    body: adminSignupSchema,
  }),
  adminSignup
);


router.post(
  "/login",
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
  superAdmin,
  validate({
    body: forgotPasswordSchema,
  }),
  adminForgotPassword
);


router.post(
  "/reset-password",
  validate({
    body: resetPasswordSchema,
  }),
  adminResetPassword
);

export default router;