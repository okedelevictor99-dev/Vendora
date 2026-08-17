import { client } from "@/api-setup/client";
import type { ApiResponse } from "@/app/response";
import type { Product, ProductListParams, ProductListData } from "@/features/client/product/product.type";

export const getProducts = async (params: ProductListParams = {}) => {
  const { data } = await client.get<ApiResponse<ProductListData>>("/product", {
    params,
  });
  return data;
};

export const getProductById = async (id: string) => {
  const { data } = await client.get<ApiResponse<Product>>(`/product/${id}`);
  return data.data;
};