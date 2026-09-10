
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminAccountApi from "@/features/admin/account/account.api";
import type { ChangeAdminNamePayload } from "@/features/admin/account/account.type";

export const useAdminProfile = () => {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: () => adminAccountApi.getAdminProfile(),
  });
};

export const useAdminAccountMutations = () => {
  const queryClient = useQueryClient();

  const changeNameMutation = useMutation({
    mutationFn: (payload: ChangeAdminNamePayload) =>
      adminAccountApi.changeAdminName(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    },
  });

  return {
    changeAdminName: changeNameMutation.mutateAsync,
    isChangingAdminName: changeNameMutation.isPending,
    changeAdminNameError: changeNameMutation.error,
  };
};