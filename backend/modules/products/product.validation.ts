import { z } from "zod";

const name = z
  .string()
  .min(2, "Product name must be at least 2 characters")
  .max(100);

const description = z
  .string()
  .min(10, "Description must be at least 10 characters")
  .max(2000);

const price = z
  .number()
  .min(0, "Price cannot be negative");

const stock = z
  .number()
  .int("Stock must be an integer")
  .min(0, "Stock cannot be negative");

const category = z
  .string()
  .min(2, "Category is required")
  .max(50);

const images = z
  .array(z.string().url("Each image must be a valid URL"))
  .optional();


export const createProductSchema = z
  .object({
    name,
    description,
    price,
    stock,
    category,
    images,
  })
  .strict();

export const updateProductSchema = z
  .object({
    name: name.optional(),
    description: description.optional(),
    price: price.optional(),
    stock: stock.optional(),
    category: category.optional(),
    images: images,
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });


export const productIdSchema = z
  .object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
  })
  .strict();

export const deleteProductSchema = productIdSchema;

export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});