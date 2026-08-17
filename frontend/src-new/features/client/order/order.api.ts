// order.api.ts
import { client } from "@/api-setup/client";
import type { ApiResponse } from "@/app/response";
import type {
  CheckoutData,
  ManualVerifyData,
  OrderListParams,
  OrderListData,
  Order,
} from "@/features/client/order/order.type";

export const checkout = async () => {
  const { data } = await client.post<ApiResponse<CheckoutData>>(
    "/order/checkout"
  );
  return data.data;
};

export const manualVerifyOrder = async (reference: string) => {
  const { data } = await client.get<ApiResponse<ManualVerifyData>>(
    `/order/verify/${reference}`
  );
  return data.data;
};

export const getUserOrders = async (params: OrderListParams = {}) => {
  const { data } = await client.get<ApiResponse<OrderListData>>("/order", {
    params,
  });
  return data.data;
};

export const getUserOrderById = async (id: string) => {
  const { data } = await client.get<ApiResponse<{ order: Order }>>(
    `/order/${id}`
  );
  return data.data.order;
};