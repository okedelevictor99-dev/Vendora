import { getOrderStats, getProductStats, getUserStats } from "./dashboard.repo";

export const getDashboardStatsService = async () => {
  const [orderStats, productStats, userStats] = await Promise.all([
    getOrderStats(),
    getProductStats(),
    getUserStats(),
  ]);

  return {
    revenue: orderStats.revenue,
    totalOrders: orderStats.totalOrders,
    totalUsers: userStats.totalUsers,
    activeUsers: userStats.activeUsers,
    deletedUsers: userStats.deletedUsers,
    recentOrders: orderStats.recentOrders,
    lowStockCount: productStats.lowStockCount,
    lowStockProducts: productStats.lowStockProducts,
  };
};