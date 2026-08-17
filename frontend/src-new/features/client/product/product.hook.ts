import { useQuery } from "@tanstack/react-query";
import * as productApi from "@/features/client/product/product.api";
import type { ProductListParams } from "@/features/client/product/product.type";

export const useProducts = (params: ProductListParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getProducts(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
  });
};