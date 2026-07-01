import mongoose from "mongoose";
import { AppError } from "../../utils/appError";
import { getPopulatedCart } from "../cart/cart.repo";
import {
  createOrder,
  findOrderByReference,
  reserveStock,
  markOrderAsDelivered,
  markOrderAsRefunded,
  markOrderAsShipped,
} from "./order.repo";
import { generateReference } from "../../utils/paystack";
import { initializePaystackTransaction, verifyPaystackPayment } from "../../utils/paystack";
import { findUserById } from "../auth/auth.repo";
import { failureWorker, successWorker } from "../webhook/webhook.services";
import { logger } from "../../configs/logger.config";
import { getPaginationOptions, buildPaginationMeta } from "../../utils/pagination";
import {
  findOrdersByUserId,
  findOrderByIdAndUserId,
  findAllOrders,
  findOrderByIdForAdmin,
  AdminOrderFilters,
} from "./order.repo";

const RESERVATION_EXPIRY_MINUTES = 20;

export const checkoutService = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) throw new AppError("User not found", 404);

  const email = user.email;
  const cart = await getPopulatedCart(userId);

  if (!cart || cart.items.length === 0) throw new AppError("Cart is empty", 400);

  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = item.product as any;

    if (!product || !product.isActive) throw new AppError(`Product ${product?.name} is no longer available`, 400);

    const availableStock = product.stock - product.reservedStock;
    if (availableStock < item.quantity) throw new AppError(`Insufficient stock for ${product.name}`, 400);

    orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
    totalAmount += product.price * item.quantity;
  }

  const reference = generateReference("ORD");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await reserveStock(
      orderItems.map((i) => ({ productId: i.product.toString(), quantity: i.quantity })),
      session
    );

    const reservationExpiry = new Date(Date.now() + RESERVATION_EXPIRY_MINUTES * 60 * 1000);

    await createOrder(
      {
        reference,
        user: new mongoose.Types.ObjectId(userId),
        items: orderItems,
        totalAmount,
        status: "initiated",
        stockReserved: true,
        stockReservationExpiry: reservationExpiry,
      },
      session
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error: any) {
    logger.error(error.message);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

  try {
    const paystack = await initializePaystackTransaction(email, totalAmount, reference);
    return { reference, paymentUrl: paystack.authorization_url };
  } catch (paystackError: any) {
    logger.error("Paystack init failed", paystackError.message);
    throw new AppError("Payment initialization failed", 500);
  }
};

export const manualVerifyOrderService = async (reference: string, userId: string) => {
  const order = await findOrderByReference(reference);
  if (!order) throw new AppError("Order not found", 404);
  if (order.user.toString() !== userId) throw new AppError("Unauthorized", 403);
  if (order.status !== "initiated") return { status: order.status };

  const result = await verifyPaystackPayment(reference);

  if (result === "success") {
    await successWorker(reference);
    const updatedOrder = await findOrderByReference(reference);
    return { status: updatedOrder?.status };
  }

  if (result === "failed") {
    await failureWorker(reference);
    return { status: "failed" };
  }

  return { status: "initiated", message: "Payment still pending, please try again shortly" };
};

export const markOrderRefundedService = async (reference: string, note?: string) => {
  const order = await markOrderAsRefunded(reference, note);

  if (!order) {
    throw new AppError(
      "Order not found or not eligible for refund. Order must be cannot_fulfill with a pending refund status.",
      400
    );
  }

  return order;
};

export const getUserOrdersService = async (userId: string, query: { page?: number; limit?: number }) => {
  const options = getPaginationOptions(query);
  const { orders, total } = await findOrdersByUserId(userId, options);
  const meta = buildPaginationMeta(total, options);

  return { orders, meta };
};

export const getUserOrderByIdService = async (orderId: string, userId: string) => {
  const order = await findOrderByIdAndUserId(orderId, userId);
  if (!order) throw new AppError("Order not found.", 404);
  return order;
};

export const getAdminOrdersService = async (query: { page?: number; limit?: number }, filters: AdminOrderFilters) => {
  const options = getPaginationOptions(query);
  const { orders, total } = await findAllOrders(options, filters);
  const meta = buildPaginationMeta(total, options);

  return { orders, meta };
};

export const getAdminOrderByIdService = async (orderId: string) => {
  const order = await findOrderByIdForAdmin(orderId);
  if (!order) throw new AppError("Order not found.", 404);
  return order;
};

export const markOrderAsShippedService = async (reference: string) => {
  const order = await markOrderAsShipped(reference);
  if (!order) throw new AppError("Order not found or is not in a paid state.", 400);
  return order;
};

export const markOrderAsDeliveredService = async (reference: string) => {
  const order = await markOrderAsDelivered(reference);
  if (!order) throw new AppError("Order not found or is not in a shipped state.", 400);
  return order;
};