
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as orderApi from "@/features/client/order/order.api";
import type { OrderListParams } from "@/features/client/order/order.type";

export const useCheckout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: orderApi.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    checkout: mutation.mutateAsync,
    isCheckingOut: mutation.isPending,
  };
};

export const useManualVerifyOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: orderApi.manualVerifyOrder,
    onSuccess: (_data, reference) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", reference] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    verifyOrder: mutation.mutateAsync,
    isVerifying: mutation.isPending,
  };
};

export const useUserOrders = (params: OrderListParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderApi.getUserOrders(params),
  });
};

export const useUserOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getUserOrderById(id),
    enabled: !!id,
  });
};