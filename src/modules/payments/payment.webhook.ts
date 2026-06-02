import mongoose from "mongoose";

import { AppError } from "../../utils/appError";

import {
  findPaymentByReference,
  updatePaymentStatusToSuccess,
  updatePaymentStatusToFailedCandidate,
} from "../payments/payment.repo";

import {
  findOrderById,
  updateOrderStatusToPaid,
  updateOrderStatusToPaidLate,
  updateOrderStatusToPaymentFailedCandidate,
  updateOrderStatusToPaidOutOfStock,
  deductStockForOrderItems,
  lockOrderForSuccess,
  finalizeOrderProcessing,
  finalizeLatePaymentOrder,
} from "../checkout/order.repo";

import { finalizeStock } from "./payment.helpers";

/* =========================
   SUCCESS HANDLER
========================= */

export const handleSuccess = async (
  order: any,
  payment: any,
  session: mongoose.ClientSession
) => {
  const lockedOrder = await lockOrderForSuccess(
    order._id.toString(),
    session
  );

  if (!lockedOrder) {
    const latestOrder = await findOrderById(order._id, session);

    if (!latestOrder) throw new AppError("Order not found", 404);

    if (latestOrder.stockReleased && !latestOrder.stockFinalized) {
      await handleLatePayment(latestOrder, session);
    }

    return;
  }

  await updatePaymentStatusToSuccess(payment.reference, session);
  await updateOrderStatusToPaid(order._id.toString(), session);
  await finalizeStock(order, session);
  await finalizeOrderProcessing(order._id.toString(), session);
};

/* =========================
   LATE PAYMENT
========================= */

export const handleLatePayment = async (
  order: any,
  session: mongoose.ClientSession
) => {
  if (order.stockFinalized) return;

  const result = await deductStockForOrderItems(order.items, session);

  if (!result.success) {
    await updateOrderStatusToPaidOutOfStock(order._id.toString(), session);
    return;
  }

  await updateOrderStatusToPaidLate(order._id.toString(), session);
  await finalizeLatePaymentOrder(order._id.toString(), session);
};

/* =========================
   FAILURE
========================= */

export const handleFailure = async (
  order: any,
  payment: any,
  session: mongoose.ClientSession
) => {
  await updatePaymentStatusToFailedCandidate(payment.reference, session);

  await updateOrderStatusToPaymentFailedCandidate(order._id.toString(), session);
};

/* =========================
   WEBHOOK ENTRY
========================= */

export const paystackWebhookService = async (event: any) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { data, event: eventType } = event;

    const payment = await findPaymentByReference(data.reference);
    if (!payment) throw new AppError("Payment not found", 404);

    const order = await findOrderById(payment.order.toString());
    if (!order) throw new AppError("Order not found", 404);

    if (eventType !== "charge.success") {
      await handleFailure(order, payment, session);
      await session.commitTransaction();
      return;
    }

    if (order.stockReleased) {
      await handleLatePayment(order, session);
    } else {
      await handleSuccess(order, payment, session);
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};