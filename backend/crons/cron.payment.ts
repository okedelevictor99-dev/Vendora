
import cron from "node-cron";
import { findOrdersForVerification, incrementVerifyAttempts } from "@/modules/client/order/order.repo";
import { verifyPaystackPayment } from "@/utils/paystack";
import { successWorker,failureWorker } from "@/modules/client/webhook/webhook.services";
import { logger } from "../configs/logger.config";

export const paymentVerificationCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    logger.info("Payment verification cron running...");

    try {
      const orders = await findOrdersForVerification();

      if (orders.length === 0){
        logger.info("No orders currently eligible for payment verification");
        return
      } 

      for (const order of orders) {
        try {
          await incrementVerifyAttempts(order.reference);

          const result = await verifyPaystackPayment(order.reference);

          if (result === "success") {
            await successWorker(order.reference);
            logger.info(`Payment verified for order ${order.reference}`);
          } else if (result === "failed") {
            await failureWorker(order.reference);
            logger.info(`Payment failed for order ${order.reference}`);
          } else {
            logger.info(`Payment inconclusive for order ${order.reference}, will retry`);
          }

        } catch (err) {
          logger.error(`Verification failed for order ${order.reference}: ${err}`);
        }
      }

    } catch (err) {
      logger.error(`Payment verification cron failed: ${err}`);
    }
  });
};