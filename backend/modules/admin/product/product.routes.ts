import Router from "express"

import { validate } from "@/middlewares/validate.middleware";
import { admin } from "@/middlewares/admin.middleware";
import { productQuerySchema,productIdSchema,createProductSchema,updateProductSchema, } from "./product.validation";
import { getAdminProductById,getAdminProducts,updateProduct,createProduct,activateProduct,deactivateProduct } from "./product.controller";

const router=Router()
router.get(
  "/",
  admin,
  validate({ query: productQuerySchema }),
  getAdminProducts
);
router.get(
  "/:id",
  admin,
  validate({ params: productIdSchema }),
  getAdminProductById
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