import cron from "node-cron";
import { findExpiredInitiatedOrders,releaseReservedStock } from "@/modules/client/order/order.repo";
import { logger } from "../configs/logger.config";

export const stockExpiryCron = () => {
  cron.schedule("*/5 * * * *", async () => {
    logger.info("Exipre order cron running")

    try {
      const expiredOrders = await findExpiredInitiatedOrders();

      if (expiredOrders.length === 0){
         logger.info("No expired orders found, cron stopped running")
         return
      }
        
        

      for (const order of expiredOrders) {
        try {
          const items = order.items.map((i) => ({
            productId: i.product.toString(),
            quantity: i.quantity,
          }));

          const released = await releaseReservedStock(
            items,
            order._id.toString(),
          );

          if (released) {
            logger.info(`Stock released for order ${order.reference}`);
          } else {
            logger.info(`Stock already released for order ${order.reference}`);
          }

        } catch (err) {
          logger.error(`Failed to release stock for order ${order.reference}: ${err}`);
        }
      }

    } catch (err) {
      logger.error(`Stock expiry cron failed: ${err}`);
    }
  });
}