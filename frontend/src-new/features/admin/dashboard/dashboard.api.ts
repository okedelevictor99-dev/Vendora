import { adminClient } from "@/api-setup/adminClient";
import type { ApiResponse } from "@/app/response";
import type { DashboardStats } from "@/features/admin/dashboard/dashboard.type";

export const getDashboardStats = async () => {
  const { data } = await adminClient.get<ApiResponse<DashboardStats>>(
    "/admin/dashboard/stats"
  );
  return data;
};