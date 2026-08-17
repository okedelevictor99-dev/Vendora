import { adminClient } from "@/api-setup/adminClient";
import type { ApiResponse } from "@/app/response";
import type {
  Order,
  AdminOrderListParams,
  OrderListData,
  RefundOrderPayload,
  AdminOrderDetailsData
} from "@/features/admin/order/order.type";

export const getAdminOrders = async (params: AdminOrderListParams = {}) => {
  const { data } = await adminClient.get<ApiResponse<OrderListData>>("/admin/order", {
    params,
  });
  return data;
};

export const getAdminOrderById = async (id: string) => {
  const { data } = await adminClient.get<ApiResponse<AdminOrderDetailsData>>(`/admin/order/${id}`);
  return data;
};

export const shipOrder = async (reference: string) => {
  const { data } = await adminClient.patch<ApiResponse<Order>>(`/admin/order/ship/${reference}`);
  return data;
};

export const deliverOrder = async (reference: string) => {
  const { data } = await adminClient.patch<ApiResponse<Order>>(`/admin/order/deliver/${reference}`);
  return data;
};

export const refundOrder = async (reference: string, payload: RefundOrderPayload) => {
  const { data } = await adminClient.patch<ApiResponse<Order>>(
    `/admin/order/refund/${reference}`,
    payload
  );
  return data;
};