import { adminClient } from "@/api-setup/adminClient";
import type { ApiResponse } from "@/app/response";
import type {
  Product,
  AdminProductListParams,
  ProductListData,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/features/admin/product/product.type";

export const getAdminProducts = async (params: AdminProductListParams = {}) => {
  const { data } = await adminClient.get<ApiResponse<ProductListData>>("/admin/product", {
    params,
  });
  return data;
};

export const getAdminProductById = async (id: string) => {
  const { data } = await adminClient.get<ApiResponse<Product>>(`/admin/product/${id}`);
  return data;
};

export const createProduct = async (payload: CreateProductPayload) => {
  const { data } = await adminClient.post<ApiResponse<Product>>("/admin/product", payload);
  return data;
};

export const updateProduct = async (id: string, payload: UpdateProductPayload) => {
  const { data } = await adminClient.put<ApiResponse<Product>>(`/admin/product/${id}`, payload);
  return data;
};

export const deactivateProduct = async (id: string) => {
  const { data } = await adminClient.patch<ApiResponse<Product>>(`/admin/product/${id}/deactivate`);
  return data;
};

export const activateProduct = async (id: string) => {
  const { data } = await adminClient.patch<ApiResponse<Product>>(`/admin/product/${id}/activate`);
  return data;
};