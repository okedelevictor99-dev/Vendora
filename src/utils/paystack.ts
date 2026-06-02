import mongoose from "mongoose";
import { updatePaymentStatusToFailedCandidate, updatePaymentStatusToSuccess } from "../modules/payments/payment.repo";
import {  updateOrderStatusToPaid, updateOrderStatusToPaidLate, updateOrderStatusToPaymentFailedCandidate,updateOrderStatusToPaidOutOfStock } from "../modules/checkout/order.repo";
import { AppError } from "./appError";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
import crypto from 'crypto'



const finalizeStock = async (
  order: any,
  session: mongoose.ClientSession
) => {
  for (const item of order.items) {
    const productId =
      item.product.toString();

    await Product.updateOne(
      { _id: productId },
      {
        $inc: {
          stock: -item.quantity,
          reservedStock:
            -item.quantity,
        },
      },
      { session }
    );
  }

  await Order.updateOne(
    { _id: order._id },
    {
      stockDeducted: true,
    },
    { session }
  );
};


export const verifyPaystackSignature =
  (rawBody: string, signature: string) => {
    const secret =
      process.env.PAYSTACK_SECRET_KEY!;

    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      throw new AppError(
        "Invalid webhook signature",
        401
      );
    }
  };


export const handleSuccess = async (
  order: any,
  payment: any,
  session: mongoose.ClientSession
) => {
  /* =========================
     1. UPDATE PAYMENT
  ========================= */

  await updatePaymentStatusToSuccess(
    payment.reference,
    session
  );

  /* =========================
     2. VALIDATE RESERVATION
  ========================= */

  const now = new Date();

  const isActiveReservation =
    now <= order.reservationExpiresAt;

  if (!isActiveReservation) {
    throw new AppError(
      "Reservation expired for active success handler",
      400
    );
  }

  /* =========================
     3. UPDATE ORDER
  ========================= */

  await updateOrderStatusToPaid(
    order._id.toString(),
    session
  );

  /* =========================
     4. FINALIZE STOCK
  ========================= */

  await finalizeStock(order, session);
};




export const handleLatePayment =
  async (
    order: any,
    session: mongoose.ClientSession
  ) => {
    /* =========================
       1. ATOMIC STOCK DEDUCTION
    ========================= */

    for (const item of order.items) {
      const result =
        await mongoose
          .model("Product")
          .updateOne(
            {
              _id: item.product,
              stock: {
                $gte:
                  item.quantity,
              },
            },
            {
              $inc: {
                stock:
                  -item.quantity,
              },
            },
            { session }
          );

      /* =========================
         2. OUT OF STOCK
      ========================= */

      if (
        result.modifiedCount ===
        0
      ) {
        await updateOrderStatusToPaidOutOfStock(
          order._id.toString(),
          session
        );

        return;
      }
    }

    /* =========================
       3. UPDATE ORDER STATUS
    ========================= */

    await updateOrderStatusToPaidLate(
      order._id.toString(),
      session
    );
  };
export const handleFailure = async (
  order: any,
  payment: any,
  session: mongoose.ClientSession
) => {
  await updatePaymentStatusToFailedCandidate(
    payment.reference,
    session
  );

  // DO NOT release stock here
  // cron job handles final decision

  await updateOrderStatusToPaymentFailedCandidate(
    order._id.toString(),
    session
  );
};

