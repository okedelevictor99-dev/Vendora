import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import {
  getCartService,
  addToCartService,
  increaseQuantityService,
  decreaseQuantityService,
  removeFromCartService,
  clearCartService,
} from "./cart.service";

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.validatedBody;
  const { userId } = req.user!;

  const cart = await addToCartService(userId, productId, quantity);

  return sendResponse(res, 200, "Product added to cart successfully", cart);
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const cart = await getCartService(userId);
  return sendResponse(res, 200, "Cart fetched successfully", cart);
});

export const increaseQuantity = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { productId } = req.validatedParams;

  const cart = await increaseQuantityService(userId, productId);

  return sendResponse(res, 200, "Quantity increased", cart);
});

export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { productId } = req.validatedParams;

  const cart = await removeFromCartService(userId, productId);

  return sendResponse(res, 200, "Item removed from cart", cart);
});

export const decreaseQuantity = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { productId } = req.validatedParams;

  const cart = await decreaseQuantityService(userId, productId);

  return sendResponse(res, 200, "Quantity decreased", cart);
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const cart= await clearCartService(userId);
  return sendResponse(res, 200, "Cart cleared successfully", cart);
});