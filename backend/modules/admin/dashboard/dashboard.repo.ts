import { Order } from "@/models/order.model";
import { Product } from "@/models/product.model";
import { User } from "@/models/user.model";

const REVENUE_STATUSES = ["paid", "shipped", "delivered"];
const LOW_STOCK_THRESHOLD = 5;

export const getOrderStats = async () => {
  const [result] = await Order.aggregate([
    {
      $facet: {
        summary: [
          { $match: { status: { $in: REVENUE_STATUSES } } },
          {
            $group: {
              _id: null,
              revenue: { $sum: "$totalAmount" },
              count: { $sum: 1 },
            },
          },
        ],
        recentOrders: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              reference: 1,
              totalAmount: 1,
              status: 1,
              createdAt: 1,
              "user.name": 1,
              "user.email": 1,
            },
          },
        ],
      },
    },
  ]);

  return {
    revenue: result.summary[0]?.revenue ?? 0,
    totalOrders: result.summary[0]?.count ?? 0,
    recentOrders: result.recentOrders,
  };
};

export const getProductStats = async () => {
  const lowStockMatch = {
    isActive: true,
    $expr: {
      $lte: [{ $subtract: ["$stock", "$reservedStock"] }, LOW_STOCK_THRESHOLD],
    },
  };

  const [result] = await Product.aggregate([
    {
      $facet: {
        lowStockProducts: [
          { $match: lowStockMatch },
          { $sort: { stock: 1 } },
          { $limit: 10 },
          { $project: { name: 1, stock: 1, reservedStock: 1 } },
        ],
        lowStockCount: [{ $match: lowStockMatch }, { $count: "count" }],
      },
    },
  ]);

  return {
    lowStockProducts: result.lowStockProducts,
    lowStockCount: result.lowStockCount[0]?.count ?? 0,
  };
};

export const getUserStats = async () => {
  const [result] = await User.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        active: [{ $match: { isDeleted: false } }, { $count: "count" }],
        deleted: [{ $match: { isDeleted: true } }, { $count: "count" }],
      },
    },
  ]);

  return {
    totalUsers: result.total[0]?.count ?? 0,
    activeUsers: result.active[0]?.count ?? 0,
    deletedUsers: result.deleted[0]?.count ?? 0,
  };
};