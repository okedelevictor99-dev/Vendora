// order.type.ts
import type { Product } from "@/features/client/product/product.type";

export type OrderStatus =
  | "initiated"
  | "paid"
  | "failed"
  | "cannot_fulfill"
  | "shipped"
  | "delivered";

export type RefundStatus = "none" | "pending" | "refunded";

export interface OrderItem {
  product: Pick<Product, "_id" | "name" | "images" | "price">;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  reference: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  refundStatus: RefundStatus;
  refundNote?: string | null;
  refundedAt?: string | null;
  stockReserved: boolean;
  stockReservationExpiry: string;
  verifyAttempts: number;
  lastVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
}

export interface OrderListData {
  orders: Order[];
  meta: PaginationMeta;
}

export interface CheckoutData {
  paymentUrl: string;
  reference: string;
}

export interface ManualVerifyData {
  status: OrderStatus;
  message?: string;
}