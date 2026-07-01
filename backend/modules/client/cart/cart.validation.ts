import { z } from "zod";
import mongoose from "mongoose";

export const addToCartSchema = z
  .object({
    productId: z.string().refine(
      (value) => mongoose.Types.ObjectId.isValid(value),
      {
        message: "Invalid product id",
      }
    ),

    quantity: z.number().int().min(1).default(1),
  })
  .strict();
  export const productIdParamSchema = z
  .object({
    productId: z.string().refine(
      (value) => mongoose.Types.ObjectId.isValid(value),
      {
        message: "Invalid product id",
      }
    ),
  })
  .strict();