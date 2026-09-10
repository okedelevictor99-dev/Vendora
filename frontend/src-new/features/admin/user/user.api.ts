// import { adminClient } from "@/api-setup/adminClient";
// import type { ApiResponse } from "@/app/response";
// import type { User, AdminUserListParams, UserListData } from "@/features/admin/user/user.type";

// export const getAdminUsers = async (params: AdminUserListParams = {}) => {
//   const { data } = await adminClient.get<ApiResponse<UserListData>>("/admin/user", {
//     params,
//   });
//   return data;
// };

// export const getAdminUserById = async (id: string) => {
//   const { data } = await adminClient.get<ApiResponse<User>>(`/admin/user/${id}`);
//   return data;
// };

// export const deactivateUser = async (id: string) => {
//   const { data } = await adminClient.patch<ApiResponse<User>>(`/admin/user/deactivate/${id}`);
//   return data;
// };

// export const activateUser = async (id: string) => {
//   const { data } = await adminClient.patch<ApiResponse<User>>(`/admin/user/activate/${id}`);
//   return data;
// };

import { adminClient } from "@/api-setup/adminClient";
import type { ApiResponse } from "@/app/response";
import type {
  User,
  AdminUserListParams,
  UserListData,
} from "@/features/admin/user/user.type";

export const getAdminUsers = async (params: AdminUserListParams = {}) => {
  const { data } = await adminClient.get<ApiResponse<UserListData>>("/admin/user", {
    params,
  });
  return data;
};

export const getAdminUserById = async (id: string) => {
  const { data } = await adminClient.get<ApiResponse<User>>(`/admin/user/${id}`);
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await adminClient.delete<ApiResponse<User>>(`/admin/user/${id}`);
  return data;
};

export const restoreUser = async (id: string) => {
  const { data } = await adminClient.patch<ApiResponse<User>>(`/admin/user/${id}/restore`);
  return data;
};