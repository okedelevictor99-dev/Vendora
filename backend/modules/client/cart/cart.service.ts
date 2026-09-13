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

export const addToCartService = async (
  userId: string,
  productId: string,
  quantity: number
) => {

  console.log("1. PRODUCT ID:", productId);

  const product = await findProductById(productId);

  console.log("2. PRODUCT:", product);

  if (!product || !product.isActive)
    throw new AppError("Product not found", 404);

  console.log("3. PRODUCT VALID");

  const availableStock = product.stock - product.reservedStock;

  console.log("4. STOCK:", {
    stock: product.stock,
    reservedStock: product.reservedStock,
    availableStock,
  });

  if (availableStock < quantity)
    throw new AppError("Insufficient stock", 400);

  let cart = await findCartByUserId(userId);

  console.log("5. CART:", cart);

  if (!cart) {
    cart = await createCart(userId);
    console.log("6. CREATED CART:", cart);
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  console.log("7. EXISTING ITEM:", existingItem);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > availableStock)
      throw new AppError("Insufficient stock", 400);

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
    });
  }

  console.log("8. CART BEFORE SAVE:", cart);

  await saveCart(cart);

  console.log("9. CART SAVED");

  const updatedCart = await getPopulatedCart(userId);

  console.log("10. POPULATED CART:", updatedCart);

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