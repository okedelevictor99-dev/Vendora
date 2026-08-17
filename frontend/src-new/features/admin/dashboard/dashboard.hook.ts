import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "@/features/admin/dashboard/dashboard.api";

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: dashboardApi.getDashboardStats,
  });
};