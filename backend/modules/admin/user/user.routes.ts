import Router from "express";

import { validate } from "@/middlewares/validate.middleware";
import { admin } from "@/middlewares/admin.middleware";
import { userQuerySchema, userIdSchema } from "./user.validation";
import { getAdminUsers, getAdminUserById, deleteUser } from "./user.controller";

const router = Router();

router.get(
  "/",
  admin,
  validate({ query: userQuerySchema }),
  getAdminUsers
);

router.get(
  "/:id",
  admin,
  validate({ params: userIdSchema }),
  getAdminUserById
);

router.delete(
  "/:id",
  admin,
  validate({ params: userIdSchema }),
  deleteUser
);

export default router;