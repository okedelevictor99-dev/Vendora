import { client } from "@/api-setup/client";
import type { ApiResponse } from "@/app/response";
import type { CartData, AddToCartPayload } from "@/features/client/cart/cart.type";

export const getCart = async () => {
  const { data } = await client.get<ApiResponse<CartData>>("/cart");
  return data;
};

export const addToCart = async (payload: AddToCartPayload) => {
  const { data } = await client.post<ApiResponse<CartData>>("/cart/add", payload);
  return data;
};

export const increaseQuantity = async (productId: string) => {
  const { data } = await client.patch<ApiResponse<CartData>>(`/cart/increase/${productId}`);
  return data;
};

export const decreaseQuantity = async (productId: string) => {
  const { data } = await client.patch<ApiResponse<CartData>>(`/cart/decrease/${productId}`);
  return data;
};

export const removeFromCart = async (productId: string) => {
  const { data } = await client.delete<ApiResponse<CartData>>(`/cart/remove/${productId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await client.delete<ApiResponse>("/cart/clear");
  return data;
};