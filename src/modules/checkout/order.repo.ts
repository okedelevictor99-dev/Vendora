import mongoose from "mongoose";
import { Order, IOrder } from "../../models/order.model";
import { Product } from "../../models/product.model";

/* =========================
   ORDER QUERIES
========================= */

export const createOrder = async (
  data: Partial<IOrder>,
  session?: mongoose.ClientSession
): Promise<IOrder> => {
  const [order] = await Order.create([data], { session });
  return order;
};

export const findOrderById = async (
  id: string,
  session?: mongoose.ClientSession
): Promise<IOrder | null> => {
  return Order.findById(id).session(session || null);
};

export const findOrderByIdempotencyKey = async (key: string) => {
  return Order.findOne({ idempotencyKey: key });
};

/* =========================
   STATUS UPDATES
========================= */

export const updateOrderStatusToPaid = async (
  orderId: string,
  session?: mongoose.ClientSession
) => {
  return Order.updateOne(
    {
      _id: orderId,
      status: { $in: ["pending_payment", "payment_failed_candidate"] },
    },
    { $set: { status: "paid" } },
    { session }
  );
};

export const updateOrderStatusToPending = async (
  orderId: string,
  session?: mongoose.ClientSession
) => {
  return Order.updateOne(
    {
      _id: orderId,
      status: "pending_payment_initiation",
    },
    { $set: { status: "pending_payment" } },
    { session }
  );
};

export const updateOrderStatusToPaymentFailedCandidate = async (
  orderId: string,
  session?: mongoose.ClientSession
) => {
  return Order.updateOne(
    {
      _id: orderId,
      status: { $in: ["pending_payment", "payment_expired"] },
    },
    { $set: { status: "payment_failed_candidate" } },
    { session }
  );
};

export const updateOrderStatusToPaidLate = async (
  orderId: string,
  session?: mongoose.ClientSession
) => {
  return Order.updateOne(
    {
      _id: orderId,
      status: { $in: ["payment_expired", "payment_failed_candidate"] },
    },
    { $set: { status: "paid_late" } },
    { session }
  );
};

export const updateOrderStatusToPaidOutOfStock = async (
  orderId: string,
  session?: mongoose.ClientSession
) => {
  return Order.updateOne(
    {
      _id: orderId,
      status: { $in: ["payment_expired", "payment_failed_candidate"] },
    },
    { $set: { status: "paid_out_of_stock" } },
    { session }
  );
};

/* =========================
   STOCK OPS
========================= */

export const deductStockForOrderItems = async (
  items: any[],
  session: mongoose.ClientSession
) => {
  for (const item of items) {
    const result = await Product.updateOne(
      {
        _id: item.product,
        stock: { $gte: item.quantity },
      },
      { $inc: { stock: -item.quantity } },
      { session }
    );

    if (result.modifiedCount === 0) {
      return { success: false, failedProduct: item.product };
    }
  }

  return { success: true };
};

/* =========================
   FINALIZATION
========================= */

export const finalizeOrderProcessing = async (
  orderId: string,
  session?: mongoose.ClientSession
) => {
  return Order.updateOne(
    { _id: orderId },
    { $set: { stockFinalized: true, processing: false } },
    { session }
  );
};

export const finalizeLatePaymentOrder = async (
  orderId: string,
  session?: mongoose.ClientSession
) => {
  return Order.updateOne(
    { _id: orderId },
    { $set: { stockFinalized: true } },
    { session }
  );
};

export const lockOrderForSuccess = async (
  orderId: string,
  session?: mongoose.ClientSession
) => {
  return Order.findOneAndUpdate(
    {
      _id: orderId,
      processing: false,
      stockReleased: false,
      stockFinalized: false,
    },
    { $set: { processing: true } },
    { session, new: true }
  );
};

export const attachPaymentReference = async (
  orderId: string,
  reference: string,
  session?: mongoose.ClientSession
) => {
  return Order.updateOne(
    {
      _id: orderId,
      status: { $in: ["pending_payment"] },
    },
    { $set: { paymentReference: reference } },
    { session }
  );
};