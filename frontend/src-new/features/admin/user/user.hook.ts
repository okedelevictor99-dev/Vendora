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

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => adminUserApi.deactivateUser(id),
    onSuccess: invalidateUsers,
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => adminUserApi.activateUser(id),
    onSuccess: invalidateUsers,
  });

  return {
    deactivateUser: deactivateMutation.mutateAsync,
    isDeactivatingUser: deactivateMutation.isPending,

    activateUser: activateMutation.mutateAsync,
    isActivatingUser: activateMutation.isPending,
  };
};