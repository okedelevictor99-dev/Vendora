import { AppError } from "../../utils/appError";
import {
  createProduct,
  findProducts,
  findProductById,
  updateProductById,
  deactivateProductById,
  activateProductById,
  findActiveProductById
} from "../products/product.repo";

export const createProductService = async (data: any) => {
  const product = await createProduct(data);
  return product;
};

export const getProductsService = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const category = query.category;
  const search = query.search;

  return await findProducts({ page, limit, category, search,isActive:true });
};
export const getAdminProductsService = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const category = query.category;
  const search = query.search;
  const status = query.status;

  let isActive: boolean | undefined;

  if (status === "active") {
    isActive = true;
  } else if (status === "inactive") {
    isActive = false;
  }

  return await findProducts({
    page,
    limit,
    category,
    search,
    isActive,
  });
};
export const getProductByIdService = async (id: string) => {
  const product = await findActiveProductById(id);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};
export const getAdminProductByIdService = async (id: string) => {
  const product = await findProductById(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const updateProductService = async (id: string, data: any) => {
  const product = await updateProductById(id, data);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

export const deactivateProductService = async (id: string) => {
  const existingProduct = await findProductById(id);

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  if (!existingProduct.isActive) {
    throw new AppError("Product is already inactive", 400);
  }

  return await deactivateProductById(id);
};

export const activateProductService = async (id: string) => {
  const existingProduct = await findProductById(id);

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  if (existingProduct.isActive) {
    throw new AppError("Product is already active", 400);
  }

  return await activateProductById(id);
};