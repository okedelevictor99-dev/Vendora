import mongoose, { Schema, Document, Types } from "mongoose";

export enum ReservationStatus {
  ACTIVE = "ACTIVE",
  CONVERTED = "CONVERTED", // becomes order paid
  RELEASED = "RELEASED",   // expired or failed
}

export interface IReservationItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IStockReservation extends Document {
  user: Types.ObjectId;
  order: Types.ObjectId;

  items: IReservationItem[];

  status: ReservationStatus;

  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const reservationItemSchema = new Schema<IReservationItem>(
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
  },
  { _id: false }
);

const reservationSchema = new Schema<IStockReservation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    items: {
      type: [reservationItemSchema],
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.ACTIVE,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index → auto cleanup expired reservations (Mongo handles this)
reservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const StockReservation = mongoose.model<IStockReservation>(
  "StockReservation",
  reservationSchema
);