import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { AppError } from "../../utils/appError";

import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../products/product.services";

/* =========================
   ➕ CREATE PRODUCT
========================= */

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.validatedBody;

    const product = await createProductService(data);

    return sendResponse(res, 201, "Product created successfully", product);
  }
);

/* =========================
   📥 GET ALL PRODUCTS
========================= */

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await getProductsService(req.query);

  return sendResponse(res, 200, "Products fetched successfully", result);
});

/* =========================
   📥 GET PRODUCT BY ID
========================= */

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.validatedParams;

    const product = await getProductByIdService(id);

    return sendResponse(res, 200, "Product fetched successfully", product);
  }
);

/* =========================
   ✏️ UPDATE PRODUCT
========================= */

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.validatedParams;
    const data = req.validatedBody;

    const product = await updateProductService(id, data);

    return sendResponse(res, 200, "Product updated successfully", product);
  }
);

/* =========================
   🗑 DELETE PRODUCT
========================= */

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.validatedParams;

    await deleteProductService(id);

    return sendResponse(res, 200, "Product deleted successfully");
  }
);