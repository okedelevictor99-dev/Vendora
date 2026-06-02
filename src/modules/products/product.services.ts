import { AppError } from "../../utils/appError";
import {
  createProduct,
  findProducts,
  findProductById,
  updateProductById,
  deleteProductById,
} from "../products/product.repo";

/* =========================
   ➕ CREATE PRODUCT
========================= */

export const createProductService = async (data: any) => {
  const product = await createProduct(data);

  return product;
};

/* =========================
   📥 GET ALL PRODUCTS
========================= */



export const getProductsService = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const category = query.category;
  const search = query.search;

  return await findProducts({
    page,
    limit,
    category,
    search,
  });
};

/* =========================
   📥 GET PRODUCT BY ID
========================= */

export const getProductByIdService = async (id: string) => {
  const product = await findProductById(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

/* =========================
   ✏️ UPDATE PRODUCT
========================= */

export const updateProductService = async (
  id: string,
  data: any
) => {
  const product = await updateProductById(id, data);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

/* =========================
   🗑 DELETE PRODUCT
========================= */

export const deleteProductService = async (id: string) => {
  const product = await deleteProductById(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};