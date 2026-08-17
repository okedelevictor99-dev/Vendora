import { AppError } from "@/utils/appError";
import { getPopulatedCart } from "@/modules/client/cart/cart.repo";
import { findProductById } from "@/modules/client/products/product.repo";
import { formatCart } from "@/utils/formatCart";

import {
  findCartByUserId,
  createCart,
  saveCart,
} from "@/modules/client/cart/cart.repo";

const getCartAndItem = async (userId: string, productId: string) => {
  const cart = await findCartByUserId(userId);
  if (!cart) throw new AppError("Cart not found", 404);

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new AppError("Product not in cart", 404);

  return { cart, item };
};

export const addToCartService = async (userId: string, productId: string, quantity: number) => {
  const product = await findProductById(productId);
  if (!product || !product.isActive) throw new AppError("Product not found", 404);

  const availableStock = product.stock - product.reservedStock;
  if (availableStock < quantity) throw new AppError("Insufficient stock", 400);

  let cart = await findCartByUserId(userId);
  if (!cart) cart = await createCart(userId);

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) throw new AppError("Requested quantity exceeds stock", 400);
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({ product: product._id, quantity });
  }

  await saveCart(cart);

  const updatedCart = await getPopulatedCart(userId);
  return formatCart(updatedCart);
};

export const getCartService = async (userId: string) => {
  const cart = await getPopulatedCart(userId);

  if (!cart) return { items: [], totalItems: 0, totalQuantity: 0, subtotal: 0 };

  return formatCart(cart);
};

export const increaseQuantityService = async (userId: string, productId: string, amount: number = 1) => {
  const { cart, item } = await getCartAndItem(userId, productId);
  const product = await findProductById(productId);
  if (!product) throw new AppError("Product not found", 404);

  const newQty = item.quantity + amount;
  const availableStock = product.stock - product.reservedStock;
  if (newQty > availableStock) throw new AppError("Not enough stock", 400);

  item.quantity = newQty;
  await saveCart(cart);

  const updatedCart = await getPopulatedCart(userId);
  return formatCart(updatedCart);
};

export const decreaseQuantityService = async (userId: string, productId: string, amount: number = 1) => {
  const { cart, item } = await getCartAndItem(userId, productId);
  const newQty = item.quantity - amount;

  if (newQty <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = newQty;
  }

  await saveCart(cart);

  const updatedCart = await getPopulatedCart(userId);
  return formatCart(updatedCart);
};

export const removeFromCartService = async (userId: string, productId: string) => {
  const cart = await findCartByUserId(userId);
  if (!cart) throw new AppError("Cart not found", 404);

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await saveCart(cart);

  const updatedCart = await getPopulatedCart(userId);
  return formatCart(updatedCart);
};

export const clearCartService = async (userId: string) => {
  const cart = await findCartByUserId(userId);
  if (!cart) throw new AppError("Cart not found", 404);

  cart.items = [];
  await saveCart(cart);

  return { items: [], totalItems: 0, totalQuantity: 0, subtotal: 0 };
};