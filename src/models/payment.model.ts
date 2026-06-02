import mongoose, { Schema, Document, Types } from "mongoose";

export type PaymentStatus =
  | "pending"
  | "success"
  | "failed_candidate"
  | "failed_final";

export interface IPayment extends Document {
  order: Types.ObjectId;

  reference: string;

  amount: number;

  status: PaymentStatus;

  provider: "paystack";

  idempotencyKey: string; // ✅ NEW (important)

  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
      index: true,
    },

    provider: {
      type: String,
      default: "paystack",
    },

    idempotencyKey: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// 🚨 IMPORTANT: prevent duplicate payment init for same order + intent
paymentSchema.index({ idempotencyKey: 1, order: 1 }, { unique: true });

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);