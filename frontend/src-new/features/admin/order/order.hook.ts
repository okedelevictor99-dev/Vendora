import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminOrderApi from "@/features/admin/order/order.api";
import type {
  AdminOrderListParams,
  RefundOrderPayload,
} from "@/features/admin/order/order.type";

export const useAdminOrders = (params: AdminOrderListParams) => {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => adminOrderApi.getAdminOrders(params),
  });
};

export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => adminOrderApi.getAdminOrderById(id),
    enabled: !!id,
  });
};

export const useAdminOrderMutations = () => {
  const queryClient = useQueryClient();

  const invalidateOrders = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const shipMutation = useMutation({
    mutationFn: (reference: string) => adminOrderApi.shipOrder(reference),
    onSuccess: invalidateOrders,
  });

  const deliverMutation = useMutation({
    mutationFn: (reference: string) => adminOrderApi.deliverOrder(reference),
    onSuccess: invalidateOrders,
  });

  const refundMutation = useMutation({
    mutationFn: ({ reference, payload }: { reference: string; payload: RefundOrderPayload }) =>
      adminOrderApi.refundOrder(reference, payload),
    onSuccess: invalidateOrders,
  });

  return {
    shipOrder: shipMutation.mutateAsync,
    isShippingOrder: shipMutation.isPending,
    shipOrderError: shipMutation.error,

    deliverOrder: deliverMutation.mutateAsync,
    isDeliveringOrder: deliverMutation.isPending,
    deliverOrderError: deliverMutation.error,

    refundOrder: refundMutation.mutateAsync,
    isRefundingOrder: refundMutation.isPending,
    refundOrderError: refundMutation.error,
  };
};