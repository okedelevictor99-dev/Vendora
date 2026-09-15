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
import { authRateLimiter } from "@/middlewares/rateLimit.middleware";

const router = Router();


router.post("/signup", authRateLimiter, validate({ body: signupSchema }), signup);

router.post(
  "/verify-email", authRateLimiter,
  validate({ body: verifyEmailSchema }),
  verifyEmail
);

router.post(
  "/resend-verification-token", authRateLimiter,
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
  "/forgot-password", authRateLimiter,
  validate({ body: forgotPasswordSchema }),
  forgotPassword
);

router.post(
  "/resend-forgot-password-token", authRateLimiter,
  validate({ body: resendForgotPasswordTokenSchema }),
  resendForgotPasswordToken
);

router.post(
  "/reset-password", authRateLimiter,
  validate({ body: resetPasswordSchema }),
  resetPassword
);


export default router;