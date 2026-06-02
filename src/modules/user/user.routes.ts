import { changeEmailSchema,changeNameSchema,changePasswordSchema,verifyChangeEmailSchema } from "../user/user.validation";
import { Router } from "express";
import { changeName,changeEmail,changePassword,verifyChangeEmail,getUserProfile } from "../user/user.controller";
import { validate } from "../../middlewares/validate.middleware";
import { user } from "../../middlewares/user.middleware";


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
router.get("/me", user, getUserProfile)

export default router