import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminUserApi from "@/features/admin/user/user.api";
import type { AdminUserListParams } from "@/features/admin/user/user.type";

export const useAdminUsers = (params: AdminUserListParams) => {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminUserApi.getAdminUsers(params),
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => adminUserApi.getAdminUserById(id),
    enabled: !!id,
  });
};

export const useAdminUserMutations = () => {
  const queryClient = useQueryClient();

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminUserApi.deleteUser(id),
    onSuccess: invalidateUsers,
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => adminUserApi.restoreUser(id),
    onSuccess: invalidateUsers,
  });

  return {
    deleteUser: deleteMutation.mutateAsync,
    isDeletingUser: deleteMutation.isPending,

    restoreUser: restoreMutation.mutateAsync,
    isRestoringUser: restoreMutation.isPending,
  };
};