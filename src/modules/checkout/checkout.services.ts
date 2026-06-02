import mongoose from "mongoose";

import { Cart } from "../../models/cart.model";

import { AppError } from "../../utils/appError";

import {
  createOrder,
  findOrderByIdempotencyKey,
} from "./order.repo";

import {
  findProductsByIds,
  reserveStock,
} from "../products/product.repo";

/* =========================
   🧾 CHECKOUT SERVICE
========================= */

export const checkoutService = async (
  data: {
    userId: string;
    cartId: string;
    idempotencyKey: string;
  }
) => {
  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    /* =========================
       1. IDEMPOTENCY CHECK
    ========================= */

    const existingOrder =
      await findOrderByIdempotencyKey(
        data.idempotencyKey
      );

    if (existingOrder) {
      return existingOrder;
    }

    /* =========================
       2. FETCH CART
    ========================= */

    const cart = await Cart.findById(
      data.cartId
    ).session(session);

    if (!cart) {
      throw new AppError(
        "Cart not found",
        404
      );
    }

    if (cart.items.length === 0) {
      throw new AppError(
        "Cart is empty",
        400
      );
    }

    /* =========================
       3. FETCH PRODUCTS
    ========================= */

    const productIds = cart.items.map(
      (item) =>
        item.product.toString()
    );

    const products =
      await findProductsByIds(
        productIds
      );

    if (
      products.length !==
      cart.items.length
    ) {
      throw new AppError(
        "Some products not found",
        404
      );
    }

    /* =========================
       4. RESERVE STOCK
       + PRICE SNAPSHOT
    ========================= */

    let totalAmount = 0;

    for (const item of cart.items) {
      const product = products.find(
        (p) =>
          p._id.toString() ===
          item.product.toString()
      );

      if (!product) {
        throw new AppError(
          "Product mismatch",
          400
        );
      }

      const reserved =
        await reserveStock(
          product._id.toString(),
          item.quantity,
          session
        );

      if (!reserved) {
        throw new AppError(
          `${product.name} is out of stock`,
          400
        );
      }

      totalAmount +=
        product.price *
        item.quantity;
    }

    /* =========================
       5. CREATE ORDER
    ========================= */

    const order = await createOrder(
      {
        user: new mongoose.Types.ObjectId(
          data.userId
        ),

        items: cart.items.map(
          (item) => {
            const product =
              products.find(
                (p) =>
                  p._id.toString() ===
                  item.product.toString()
              )!;

            return {
              product: product._id,

              quantity:
                item.quantity,

              priceAtPurchase:
                product.price,
            };
          }
        ),

        totalAmount,

        status:
          "pending_payment_initiation",

        reservationExpiresAt:
          new Date(
            Date.now() +
              15 * 60 * 1000
          ),

        idempotencyKey:
          data.idempotencyKey,

        stockReleased: false,

        stockFinalized: false,
      },

      session
    );

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};