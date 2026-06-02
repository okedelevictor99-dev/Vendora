import { Router } from "express";

import { validate } from "../../middlewares/validate.middleware";
import { admin } from "../../middlewares/admin.middleware";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../products/product.controller";

import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productQuerySchema
} from "../products/product.validation";

const router = Router();

/* =========================
   📥 PUBLIC ROUTES
========================= */

// Get all products
router.get(
  "/",
  validate({ query: productQuerySchema }),
  getProducts
);

// Get single product
router.get(
  "/:id",
  validate({ params: productIdSchema }),
  getProductById
);

/* =========================
   🔐 PROTECTED ROUTES
   (admin-only later)
========================= */

// Create product
router.post(
  "/",
  admin,
  validate({ body: createProductSchema }),
  createProduct
);

// Update product
router.put(
  "/:id",
  admin,
  validate({
    params: productIdSchema,
    body: updateProductSchema,
  }),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  admin,
  validate({ params: productIdSchema }),
  deleteProduct
);

export default router;