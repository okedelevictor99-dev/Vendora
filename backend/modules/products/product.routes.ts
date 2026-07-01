import { Router } from "express";

import { validate } from "../../middlewares/validate.middleware";
import { admin } from "../../middlewares/admin.middleware";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deactivateProduct,
  activateProduct,
  getAdminProducts,
  getAdminProductById
} from "../products/product.controller";

import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productQuerySchema,
} from "../products/product.validation";

const router = Router();

router.get(
  "/",
  validate({ query: productQuerySchema }),
  getProducts
);
router.get(
  "/admin",
  admin,
  validate({ query: productQuerySchema }),
  getAdminProducts
);
router.get(
  "/admin/:id",
  admin,
  validate({ params: productIdSchema }),
  getAdminProductById
);
router.get(
  "/:id",
  validate({ params: productIdSchema }),
  getProductById
);

router.post(
  "/",
  admin,
  validate({ body: createProductSchema }),
  createProduct
);

router.put(
  "/:id",
  admin,
  validate({
    params: productIdSchema,
    body: updateProductSchema,
  }),
  updateProduct
);

router.patch(
  "/:id/deactivate",
  admin,
  validate({ params: productIdSchema }),
  deactivateProduct
);

router.patch(
  "/:id/activate",
  admin,
  validate({ params: productIdSchema }),
  activateProduct
);
export default router;