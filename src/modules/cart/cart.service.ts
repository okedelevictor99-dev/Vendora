import { AppError } from "../../utils/appError";
import { getPopulatedCart } from "./cart.repo";
import { findProductById } from "../products/product.repo";

import {
  findCartByUserId,
  createCart,
  saveCart,
} from "./cart.repo";

const getCartAndItem = async (userId: string, productId: string) => {
  const cart = await findCartByUserId(userId);

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) {
    throw new AppError("Product not in cart", 404);
  }

  return { cart, item };
};

export const addToCartService = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  // check product exists
  const product = await findProductById(productId);

  if (!product || !product.isActive) {
    throw new AppError("Product not found", 404);
  }

  // stock validation
  if (product.stock < quantity) {
    throw new AppError("Insufficient stock", 400);
  }

  // find cart
  let cart = await findCartByUserId(userId);

  // create cart if none
  if (!cart) {
    cart = await createCart(userId);
  }


  // check existing cart item
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new AppError(
        "Requested quantity exceeds stock",
        400
      );
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
    });
  }

  await saveCart(cart);

  return cart;
};


export const getCartService = async (userId: string) => {
  const cart = await getPopulatedCart(userId);

  // no cart yet
  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      totalQuantity: 0,
      subtotal: 0,
    };
  }

  let subtotal = 0;
  let totalQuantity = 0;

  const formattedItems = cart.items.map((item: any) => {
    const product = item.product;

    const itemSubtotal =
      product.price * item.quantity;

    subtotal += itemSubtotal;

    totalQuantity += item.quantity;

    return {
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        isActive: product.isActive,
      },

      quantity: item.quantity,

      subtotal: itemSubtotal,
    };
  });

  return {
    items: formattedItems,
    totalItems: formattedItems.length,
    totalQuantity,
    subtotal,
  };
};

export const increaseQuantityService = async (
  userId: string,
  productId: string,
  amount: number = 1
) => {
  const { cart, item } = await getCartAndItem(userId, productId);

  const product = await findProductById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const newQty = item.quantity + amount;

  if (newQty > product.stock) {
    throw new AppError("Not enough stock", 400);
  }

  item.quantity = newQty;

  await saveCart(cart);

  return cart;
};

export const decreaseQuantityService = async (
  userId: string,
  productId: string,
  amount: number = 1
) => {
  const { cart, item } = await getCartAndItem(userId, productId);
  

  const newQty = item.quantity - amount;

  if (newQty <= 0) {
    // remove item completely
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );
  } else {
    item.quantity = newQty;
  }

  await saveCart(cart);

  return cart;
};

export const removeFromCartService = async (
  userId: string,
  productId: string
) => {
  const cart = await findCartByUserId(userId);

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  await saveCart(cart);

  return cart;
};

export const clearCartService = async (
  userId: string
) => {
  const cart = await findCartByUserId(userId);

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = [];

  await saveCart(cart);

  return cart;
};