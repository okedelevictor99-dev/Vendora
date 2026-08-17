import {Router}from "express"
import { validate } from "@/middlewares/validate.middleware";
import { adminOrdersQuerySchema,mongoIdSchema,updateOrderToRefundedSchema } from "./order.validation";
import { referenceParamSchema } from "@/modules/client/order/order.validation";
import { getAdminOrderById,getAdminOrders,markOrderAsDelivered,markOrderAsShipped,markOrderRefunded } from "./order.controller";
import { admin } from "@/middlewares/admin.middleware";
const router=Router()
router.get(
  "/",
  admin,
  validate({ query: adminOrdersQuerySchema }),
  getAdminOrders
);

router.get(
  "/:id",
  admin,
  validate({ params: mongoIdSchema }),
  getAdminOrderById
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
export default router
