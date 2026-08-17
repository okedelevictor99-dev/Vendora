import { Router } from "express";

import {
  changeAdminNameSchema,
} from "@/modules/admin/account/account.validation";
import {
  changeAdminName,
  getAdminProfile,
} from "@/modules/admin/account/account.controller";
import { validate } from "@/middlewares/validate.middleware";
import { admin } from "@/middlewares/admin.middleware";

const router = Router();

router.patch(
  "/change-name",
  admin,
  validate({ body: changeAdminNameSchema }),
  changeAdminName
);


router.get("/", admin, getAdminProfile);

export default router;