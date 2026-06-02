import axios from "axios";
import mongoose from "mongoose";

import { AppError } from "../../utils/appError";
import { Order } from "../../models/order.model";

import {
  createPayment,
  findPaymentByIdempotencyKey,
} from "../payments/payment.repo";

import {
  attachPaymentReference,
  updateOrderStatusToPending,
} from "../checkout/order.repo";

/* =========================
   CONFIG
========================= */

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_INIT_URL =
  "https://api.paystack.co/transaction/initialize";

/* =========================
   INIT PAYMENT
========================= */

export const initPaymentService = async (data: {
  orderId: string;
  email: string;
  idempotencyKey: string;
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existing = await findPaymentByIdempotencyKey(
      data.idempotencyKey
    );

    if (existing) return existing;

    const order = await Order.findById(data.orderId).session(session);

    if (!order) throw new AppError("Order not found", 404);

    if (order.status === "paid" || order.status === "paid_late") {
      throw new AppError("Order already paid", 400);
    }

    if (order.status === "cancelled") {
      throw new AppError("Order cancelled", 400);
    }

    const response = await axios.post(
      PAYSTACK_INIT_URL,
      {
        email: data.email,
        amount: order.totalAmount * 100,
        metadata: { orderId: order._id.toString() },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const paystackData = response.data.data;

    const payment = await createPayment(
      {
        order: order._id,
        reference: paystackData.reference,
        amount: order.totalAmount,
        status: "pending",
        provider: "paystack",
        idempotencyKey: data.idempotencyKey,
      },
      session
    );

    await updateOrderStatusToPending(order._id.toString(), session);

    await attachPaymentReference(
      order._id.toString(),
      paystackData.reference,
      session
    );

    await session.commitTransaction();

    return {
      payment,
      authorization_url: paystackData.authorization_url,
      reference: paystackData.reference,
    };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/* =========================
   VERIFY PAYMENT
========================= */

export const verifyPaystackPayment = async (reference: string) => {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    }
  );

  return response.data.data;
};