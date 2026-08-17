import { Router } from "express";

import { validate } from "@/middlewares/validate.middleware";

import {
  getProducts,
  getProductById,
  
} from "@/modules/client/products/product.controller";

import {
  productIdSchema,
  productQuerySchema,
} from "@/modules/client/products/product.validation";

const router = Router();

router.get(
  "/",
  validate({ query: productQuerySchema }),
  getProducts
);

router.get(
  "/:id",
  validate({ params: productIdSchema }),
  getProductById
);

export default router;