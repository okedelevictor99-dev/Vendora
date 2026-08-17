// src/modules/order/order.routes.ts

import { Router } from "express";
import { validate } from "@/middlewares/validate.middleware";
import { user } from "@/middlewares/user.middleware";
import { admin } from "@/middlewares/admin.middleware";
import {
  checkout,
  manualVerifyOrder,
  getUserOrders,
  getUserOrderById,
} from "@/modules/client/order/order.controller";
import {
  referenceParamSchema,
  updateOrderToRefundedSchema,
  paginationSchema,
  mongoIdSchema,
  adminOrdersQuerySchema,
} from "@/modules/client/order/order.validation";

const router = Router();


router.post(
  "/checkout",
  user,
  checkout
);

router.get(
  "/verify/:reference",
  user,
  validate({ params: referenceParamSchema }),
  manualVerifyOrder
);

router.get(
  "/",
  user,
  validate({ query: paginationSchema }),
  getUserOrders
);

router.get(
  "/:id",
  user,
  validate({ params: mongoIdSchema }),
  getUserOrderById
);



export default router;