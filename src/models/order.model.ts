import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";

export type OrderStatus =
  | "pending_payment_initiation"
  | "pending_payment"
  | "paid"
  | "paid_late"
  | "paid_out_of_stock"
  | "payment_expired"
  | "payment_failed_candidate"
  | "payment_failed_final"
  | "cancelled";

export interface IOrderItem {
  product: Types.ObjectId;

  quantity: number;

  // snapshot price
  priceAtPurchase: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;

  items: IOrderItem[];

  totalAmount: number;

  status: OrderStatus;

  paymentReference?: string;

  reservationExpiresAt: Date;

  idempotencyKey: string;

  processing: boolean

  // ✅ whether reserved stock was released
  stockReleased: boolean;

  // ✅ whether actual stock deduction happened
  stockFinalized: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema =
  new Schema<IOrderItem>(
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

      priceAtPurchase: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    { _id: false }
  );

const orderSchema = new Schema<IOrder>(
  {
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
      required: true,
      enum: [
        "pending_payment_initiation",
        "pending_payment",
        "paid",
        "paid_late",
        "paid_out_of_stock",
        "payment_expired",
        "payment_failed_candidate",
        "payment_failed_final",
        "cancelled",
      ],
      index: true,
    },

    paymentReference: {
      type: String,
      default: null,
      sparse: true,
      index: true,
    },

    reservationExpiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ✅ reservation released already?
    stockReleased: {
      type: Boolean,
      default: false,
    },
    
    processing: {
      type: Boolean,
      default: false,
    },


    // ✅ actual stock deducted already?
    stockFinalized: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Order =
  mongoose.model<IOrder>(
    "Order",
    orderSchema
  );