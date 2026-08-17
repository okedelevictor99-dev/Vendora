import { changeEmailSchema,changeNameSchema,changePasswordSchema,verifyChangeEmailSchema,resendChangeEmailOtpSchema } from "@/modules/client/user/user.validation";
import { Router } from "express";
import { changeName,changeEmail,changePassword,verifyChangeEmail,getUserProfile,resendChangeEmailOtp } from "@/modules/client/user/user.controller";
import { validate } from "@/middlewares/validate.middleware";
import { user } from "@/middlewares/user.middleware";


const router= Router()
router.patch(
  "/change-name",
  user,
  validate({ body: changeNameSchema }),
  changeName
);
router.patch(
  "/change-email",
  user,
  validate({ body: changeEmailSchema }),
  changeEmail
);
router.post(
  "/resend-email-change-otp",
  validate({ body: resendChangeEmailOtpSchema }),
  resendChangeEmailOtp
);

router.post(
  "/verify-email-change",
  validate({ body: verifyChangeEmailSchema }),
  verifyChangeEmail
);
router.patch(
  "/change-password",
  user,
  validate({ body: changePasswordSchema }),
  changePassword
);
router.get("/", user, getUserProfile)

export default router