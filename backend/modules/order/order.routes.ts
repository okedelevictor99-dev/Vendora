// src/modules/order/order.routes.ts

import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { user } from "../../middlewares/user.middleware";
import { admin } from "../../middlewares/admin.middleware";
import {
  checkout,
  manualVerifyOrder,
  markOrderRefunded,
  getUserOrders,
  getUserOrderById,
  getAdminOrders,
  getAdminOrderById,
  markOrderAsShipped,
  markOrderAsDelivered,
} from "./order.controller";
import {
  referenceParamSchema,
  updateOrderToRefundedSchema,
  paginationSchema,
  mongoIdSchema,
  adminOrdersQuerySchema,
} from "./order.validation";

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
  "/admin/",
  admin,
  validate({ query: adminOrdersQuerySchema }),
  getAdminOrders
);

router.get(
  "/admin/:id",
  admin,
  validate({ params: mongoIdSchema }),
  getAdminOrderById
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


router.patch(
  "/refund/:reference",
  admin,
  validate({
    params: referenceParamSchema,
    body: updateOrderToRefundedSchema,
  }),
  markOrderRefunded
);

router.patch(
  "/ship/:reference",
  admin,
  validate({ params: referenceParamSchema }),
  markOrderAsShipped
);

router.patch(
  "/deliver/:reference",
  admin,
  validate({ params: referenceParamSchema }),
  markOrderAsDelivered
);


export default router;