import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus =
  | "initiated"
  | "paid"
  | "failed"
  | "cannot_fulfill"
  | "shipped"
  | "delivered"


export type RefundStatus = "none" | "pending" | "refunded" ;

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number; 
}

export interface IOrder extends Document {
  reference: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;

  status: OrderStatus;

  refundStatus: RefundStatus;

  refundNote?: string | null;
  refundedAt?: Date | null;
  stockReserved: boolean;
  stockReservationExpiry: Date;
  verifyAttempts: number;
  lastVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["initiated", "paid", "failed", "cannot_fulfill","shipped","delivered"],
      default: "initiated",
      index: true,
    },

    refundStatus: {
      type: String,
      enum: ["none", "pending","refunded"],
      default: "none",
    },

    refundNote: {
    type: String,
    default: null,
   },

   refundedAt: {
   type: Date,
   default: null,
   },
    stockReserved: {
      type: Boolean,
      default: false,
    },
    stockReservationExpiry: {
      type: Date,
      required: true,
    },
    verifyAttempts: {
      type: Number,
      default: 0,
    },
    lastVerifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, verifyAttempts: 1, stockReservationExpiry: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);