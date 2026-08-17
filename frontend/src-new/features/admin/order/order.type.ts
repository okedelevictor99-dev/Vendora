export type OrderStatus =
  | "initiated"
  | "paid"
  | "failed"
  | "cannot_fulfill"
  | "shipped"
  | "delivered";

export type RefundStatus = "none" | "pending" | "refunded" | "manual_review";

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface OrderItemProduct {
  _id: string;
  name: string;
  images: string[];
  price: number;
  category: string;
}

export interface OrderItem {
  product: OrderItemProduct;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  reference: string;
  user: OrderUser;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  refundStatus: RefundStatus;
  refundNote?: string | null;
  refundedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  refundStatus?: RefundStatus;
}

export interface OrderListData {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RefundOrderPayload {
  note?: string;
}
export interface AdminOrderDetailsData {
  order: Order;
}