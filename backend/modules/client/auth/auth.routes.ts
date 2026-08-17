import { Router } from "express";

import {
  signup,
  verifyEmail,
  resendVerificationToken,
  login,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resendForgotPasswordToken,
  resetPassword,
} from "@/modules/client/auth/auth.controller";


import { validate } from "@/middlewares/validate.middleware";
import{
  signupSchema,
  verifyEmailSchema,
  resendVerificationTokenSchema,
  loginSchema,
  forgotPasswordSchema,
  resendForgotPasswordTokenSchema,
  resetPasswordSchema
} from "@/modules/client/auth/auth.validation";


import { user } from "@/middlewares/user.middleware";

const router = Router();


router.post("/signup", validate({ body: signupSchema }), signup);

router.post(
  "/verify-email",
  validate({ body: verifyEmailSchema }),
  verifyEmail
);

router.post(
  "/resend-verification-token",
  validate({ body: resendVerificationTokenSchema }),
  resendVerificationToken
);

router.post("/login", validate({ body: loginSchema }), login);

router.post(
  "/refresh-token",
  refreshToken
);

router.post("/logout",logout);

router.post("/logout-all", user, logoutAll);

router.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema }),
  forgotPassword
);

router.post(
  "/resend-forgot-password-token",
  validate({ body: resendForgotPasswordTokenSchema }),
  resendForgotPasswordToken
);

router.post(
  "/reset-password",
  validate({ body: resetPasswordSchema }),
  resetPassword
);


export default router;