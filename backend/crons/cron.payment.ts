
import cron from "node-cron";
import {  incrementVerifyAttempts } from "@/modules/client/order/order.repo";
import { verifyPaystackPayment } from "@/utils/paystack";
import { successWorker,failureWorker } from "@/modules/client/webhook/webhook.services";
import { Order } from "@/models/order.model";
import { logger } from "../configs/logger.config";

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