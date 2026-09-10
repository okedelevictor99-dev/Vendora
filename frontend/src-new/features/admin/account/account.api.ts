
import { adminClient } from "@/api-setup/adminClient";
import type { ApiResponse } from "@/app/response";
import type {
  AdminProfile,
  ChangeAdminNamePayload,
  ChangeAdminNameData,
} from "@/features/admin/account/account.type";

export const getAdminProfile = async () => {
  const { data } = await adminClient.get<ApiResponse<AdminProfile>>("/admin/account");
  return data;
};

export const changeAdminName = async (payload: ChangeAdminNamePayload) => {
  const { data } = await adminClient.patch<ApiResponse<ChangeAdminNameData>>(
    "/admin/account/change-name",
    payload
  );
  return data;
};