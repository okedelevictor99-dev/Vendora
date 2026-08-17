import mongoose from "mongoose";
import { AppError } from "@/utils/appError";
import { getPopulatedCart } from "@/modules/client/cart/cart.repo";
import {
  createOrder,
  findOrderByReference,
  reserveStock
} from "@/modules/client/order/order.repo";
import { generateReference } from "@/utils/paystack";
import { initializePaystackTransaction, verifyPaystackPayment } from "@/utils/paystack";
import { findUserById } from "@/modules/client/auth/auth.repo";
import { failureWorker, successWorker } from "@/modules/client/webhook/webhook.services";
import { logger } from "@/configs/logger.config";
import { getPaginationOptions, buildPaginationMeta } from "@/utils/pagination";
import {
  findOrdersByUserId,
  findOrderByIdAndUserId
} from "@/modules/client/order/order.repo";

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

