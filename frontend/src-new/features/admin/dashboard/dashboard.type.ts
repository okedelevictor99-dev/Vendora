export interface DashboardRecentOrder {
  _id: string;
  reference: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export interface DashboardLowStockProduct {
  _id: string;
  name: string;
  stock: number;
  reservedStock: number;
}

export interface DashboardStats {
  revenue: number;
  totalOrders: number;
  totalUsers: number;
  activeUsers: number;
  deletedUsers: number;
  recentOrders: DashboardRecentOrder[];
  lowStockCount: number;
  lowStockProducts: DashboardLowStockProduct[];
}