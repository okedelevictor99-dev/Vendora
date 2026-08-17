import { markOrderAsRefunded,findAllOrders,findOrderByIdForAdmin,markOrderAsDelivered,markOrderAsShipped,AdminOrderFilters } from "./order.repo";
import { AppError } from "@/utils/appError";
import { getPaginationOptions,buildPaginationMeta } from "@/utils/pagination";



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

export const getAdminOrdersService = async (
  query: {
    page?: number;
    limit?: number;
    search?: string;
  },
  filters: AdminOrderFilters
) => {
  const options = getPaginationOptions(query);

  const { orders, total } = await findAllOrders(options, {
    ...filters,
    search: query.search,
  });

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