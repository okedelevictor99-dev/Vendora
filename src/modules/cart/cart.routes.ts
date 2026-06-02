import { Router } from "express";

import { user } from "../../middlewares/user.middleware";
import { validate } from "../../middlewares/validate.middleware";

import { addToCart,getCart,increaseQuantity,decreaseQuantity,removeFromCart,clearCart } from "./cart.controller";

import { addToCartSchema } from "./cart.validation";
import { productIdParamSchema } from "./cart.validation";

const router = Router();

/* =========================
   CART ROUTES
========================= */

router.post(
  "/add",
  user,
  validate({ body: addToCartSchema }),
  addToCart
);
router.get("/", user, getCart);
router.patch(
  "/increase/:productId",
  user,
  validate({ params: productIdParamSchema }),
  increaseQuantity
);

router.patch(
  "/decrease/:productId",
  user,
  validate({ params: productIdParamSchema }),
  decreaseQuantity
);

router.delete(
  "/remove/:productId",
  user,
  validate({ params: productIdParamSchema }),
  removeFromCart
);

router.delete("/clear", user, clearCart);

export default router;