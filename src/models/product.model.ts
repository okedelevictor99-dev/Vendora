import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;

  stock: number;
  reservedStock: number; // 🆕 important for safe checkout

  category: string;
  images: string[];

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      index: true,
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // 🆕 prevents overselling under concurrency
    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    images: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

/* =========================
   ⚡ HELPER METHODS (OPTIONAL BUT PRO LEVEL)
========================= */

// available stock = stock - reservedStock
productSchema.methods.getAvailableStock = function () {
  return this.stock - this.reservedStock;
};

// safe stock check
productSchema.methods.canReserve = function (qty: number) {
  return this.stock - this.reservedStock >= qty;
};

export const Product = mongoose.model<IProduct>(
  "Product",
  productSchema
);