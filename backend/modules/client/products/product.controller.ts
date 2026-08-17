import { Request, Response } from "express";

import { asyncHandler } from "@/utils/asyncHandler";
import { sendResponse } from "@/utils/response";
import { AppError } from "@/utils/appError";

import {
  getProductsService,
  getProductByIdService,
 
} from "@/modules/client/products/product.services";


export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await getProductsService(req.query);
  return sendResponse(res, 200, "Products fetched successfully", result);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams;
  const product = await getProductByIdService(id);
  return sendResponse(res, 200, "Product fetched successfully", product);
});

