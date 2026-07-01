import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;

  stock: number;
  reservedStock: number; 

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


productSchema.index({ isActive: 1, stock: 1, reservedStock: 1 });

export const Product = mongoose.model<IProduct>(
  "Product",
  productSchema
);