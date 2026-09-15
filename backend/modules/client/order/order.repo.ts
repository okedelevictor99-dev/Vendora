// order.repo.ts
import mongoose from "mongoose";
import { Order, IOrder } from "@/models/order.model";
import { Product } from "@/models/product.model";
import { AppError } from "@/utils/appError";
import { PaginationOptions, getSkip } from "@/utils/pagination";
import { logger } from "@/configs/logger.config";

export const createOrder = async (
  data: Partial<IOrder>,
  session: mongoose.ClientSession
) => {
  const [order] = await Order.create([data], { session });
  return order;
};

export const findOrderByReference = async (
  reference: string,
  session?: mongoose.ClientSession
) => {
  return Order.findOne({ reference }).session(session ?? null);
};

export const findOrderById = async (id: string) => {
  return Order.findById(id);
};

export const updateOrderByReference = async (
  reference: string,
  update: Partial<IOrder>
) => {
  return Order.findOneAndUpdate(
    { reference },
    { $set: update },
    { new: true }
  );
};

export const markOrderAsPaid = async (
  reference: string,
  session: mongoose.ClientSession
) => {
  return Order.findOneAndUpdate(
    { reference, status: "initiated" }, 
    { $set: { status: "paid" } },
    { new: true, session }
  );
};

export const markOrderAsFailed = async (
  reference: string,
  session: mongoose.ClientSession
) => {
  return Order.findOneAndUpdate(
    { reference, status: "initiated" }, 
    { $set: { status: "failed" } },
    { new: true, session }
  );
};





export const markOrderAsRefunded = async (
  reference: string,
  note?: string,
) => {
  return Order.findOneAndUpdate(
    { 
      reference, 
      status: "cannot_fulfill", 
      refundStatus: "pending",  
    },
    { 
      $set: { 
        refundStatus: "refunded",
        ...(note && { refundNote: note }),
        refundedAt: new Date(),
      } 
    },
    { new: true }
  );
};

export const fulfillFromAvailableStock = async (
  items: { productId: string; quantity: number }[],
  session: mongoose.ClientSession
) => {
  for (const item of items) {
    const result = await Product.findOneAndUpdate(
      {
        _id: item.productId,
        $expr: {
          $gte: [
            { $subtract: ["$stock", "$reservedStock"] },
            item.quantity,
          ],
        },
      },
      {
        $inc: { stock: -item.quantity },
      },
      { new: true, session }
    );

    if (!result) return false;
  }
  return true;
};


export const deductReservedStock = async (
  items: { productId: string; quantity: number }[],
  orderId: string,
  session: mongoose.ClientSession
) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, stockReserved: true },
    { $set: { stockReserved: false } },
    { new: true, session }
  );
  if (!order) return false;

  for (const item of items) {
    const result = await Product.findOneAndUpdate(
      {
        _id: item.productId,
        stock: { $gte: item.quantity },
        reservedStock: { $gte: item.quantity },
      },
      {
        $inc: {
          stock: -item.quantity,
          reservedStock: -item.quantity,
        },
      },
      { new: true, session }
    );

    if (!result) return false;
  }

  return true;
};



export const reserveStock = async (
  items: { productId: string; quantity: number }[],
  session: mongoose.ClientSession
) => {
  for (const item of items) {
    const result = await Product.findOneAndUpdate(
      {
        _id: item.productId,
        isActive: true,
        $expr: {
          $gte: [
            { $subtract: ["$stock", "$reservedStock"] },
            item.quantity,
          ],
        },
      },
      { $inc: { reservedStock: item.quantity } },
      { new: true, session }
    );

    if (!result) {
      throw new AppError(
        `Product ${item.productId} is out of stock`,
        400
      );
    }
  }
};


export const releaseReservedStock = async (
  items: { productId: string; quantity: number }[],
  orderId: string,
  session?: mongoose.ClientSession
) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, stockReserved: true },
    { $set: { stockReserved: false } },
    { new: true, session }
  );

  if (!order) return false;

  for (const item of items) {
    await Product.findOneAndUpdate(
      {
        _id: item.productId,
        reservedStock: { $gte: item.quantity }, 
      },
      { $inc: { reservedStock: -item.quantity } },
      { session }
    );
  }

  return true;
};


export const findExpiredInitiatedOrders = async () => {
  return Order.find({
    status: "initiated",
    stockReserved: true,
    stockReservationExpiry: { $lte: new Date() },
  });
};




export const findOrdersForVerification = async () => {
  const now = new Date();

  const twentyMinutesAgo = new Date(
    now.getTime() - 20 * 60 * 1000
  );

  const fiveMinutesAgo = new Date(
    now.getTime() - 5 * 60 * 1000
  );

  logger.info({
    now: now.toISOString(),
    twentyMinutesAgo: twentyMinutesAgo.toISOString(),
    fiveMinutesAgo: fiveMinutesAgo.toISOString(),
  });

  const orders = await Order.find({
    status: "initiated",
    verifyAttempts: { $lt: 5 },
    createdAt: { $lte: twentyMinutesAgo },
    $or: [
      { lastVerifiedAt: null },
      { lastVerifiedAt: { $lte: fiveMinutesAgo } },
    ],
  });

  logger.info({
    ordersFound: orders.length,
    references: orders.map((order) => order.reference),
  });

  return orders;
};

export const incrementVerifyAttempts = async (
  reference: string,
) => {
  return Order.findOneAndUpdate(
    { reference },
    {
      $inc: { verifyAttempts: 1 },
      $set: { lastVerifiedAt: new Date() },
    },
    { new: true }
  );
};










export const findOrdersByUserId = async (
  userId: string,
  options: PaginationOptions
) => {
  const skip = getSkip(options);

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(options.limit)
      .lean(),
    Order.countDocuments({ user: userId }),
  ]);

  return { orders, total };
};

export const findOrderByIdAndUserId = async (
  orderId: string,
  userId: string
) => {
  return Order.findOne({ _id: orderId, user: userId })
    .populate("items.product", "name images price")
    .lean();
};



