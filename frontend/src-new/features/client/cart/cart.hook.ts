import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "@/features/client/cart/cart.api"
import type { AddToCartPayload } from "@/features/client/cart/cart.type";

export const useCart = () => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.getCart(),
  });

  const invalidateCart = () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  const addToCartMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) => cartApi.addToCart(payload),
    onSuccess: invalidateCart,
  });

  const increaseQuantityMutation = useMutation({
    mutationFn: (productId: string) => cartApi.increaseQuantity(productId),
    onSuccess: invalidateCart,
  });

  const decreaseQuantityMutation = useMutation({
    mutationFn: (productId: string) => cartApi.decreaseQuantity(productId),
    onSuccess: invalidateCart,
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (productId: string) => cartApi.removeFromCart(productId),
    onSuccess: invalidateCart,
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: invalidateCart,
  });

  return {
    cart: cartQuery.data?.data,
    isLoadingCart: cartQuery.isLoading,
    cartError: cartQuery.error,

    addToCart: addToCartMutation.mutateAsync,
    isAddingToCart: addToCartMutation.isPending,
    addToCartError: addToCartMutation.error,

    increaseQuantity: increaseQuantityMutation.mutateAsync,
    isIncreasingQuantity: increaseQuantityMutation.isPending,

    decreaseQuantity: decreaseQuantityMutation.mutateAsync,
    isDecreasingQuantity: decreaseQuantityMutation.isPending,

    removeFromCart: removeFromCartMutation.mutateAsync,
    isRemovingFromCart: removeFromCartMutation.isPending,

    clearCart: clearCartMutation.mutateAsync,
    isClearingCart: clearCartMutation.isPending,
  };
};