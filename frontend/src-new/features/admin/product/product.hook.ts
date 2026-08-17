import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminProductApi from "@/features/admin/product/product.api";
import type {
  AdminProductListParams,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/features/admin/product/product.type";

export const useAdminProducts = (params: AdminProductListParams) => {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: () => adminProductApi.getAdminProducts(params),
  });
};

export const useAdminProduct = (id: string) => {
  return useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => adminProductApi.getAdminProductById(id),
    enabled: !!id,
  });
};

export const useAdminProductMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateProductPayload) => adminProductApi.createProduct(payload),
    onSuccess: invalidateProducts,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      adminProductApi.updateProduct(id, payload),
    onSuccess: invalidateProducts,
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => adminProductApi.deactivateProduct(id),
    onSuccess: invalidateProducts,
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => adminProductApi.activateProduct(id),
    onSuccess: invalidateProducts,
  });

  return {
    createProduct: createMutation.mutateAsync,
    isCreatingProduct: createMutation.isPending,
    createProductError: createMutation.error,

    updateProduct: updateMutation.mutateAsync,
    isUpdatingProduct: updateMutation.isPending,
    updateProductError: updateMutation.error,

    deactivateProduct: deactivateMutation.mutateAsync,
    isDeactivatingProduct: deactivateMutation.isPending,

    activateProduct: activateMutation.mutateAsync,
    isActivatingProduct: activateMutation.isPending,
  };
};