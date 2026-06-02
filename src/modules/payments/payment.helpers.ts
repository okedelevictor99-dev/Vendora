import mongoose from "mongoose";
import crypto from "crypto";
import { Product } from "../../models/product.model";
import { AppError } from "../../utils/appError";

/* =========================
   STOCK FINALIZATION
========================= */

export const finalizeStock = async (
  order: any,
  session: mongoose.ClientSession
) => {
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product },
      {
        $inc: {
          stock: -item.quantity,
          reservedStock: -item.quantity,
        },
      },
      { session }
    );
  }
};

/* =========================
   PAYSTACK SIGNATURE
========================= */

export const verifyPaystackSignature = (
  rawBody: string,
  signature: string
) => {
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    throw new AppError("Invalid webhook signature", 401);
  }
};