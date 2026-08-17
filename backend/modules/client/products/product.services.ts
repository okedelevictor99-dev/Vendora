import { AppError } from "@/utils/appError";
import {
  findProducts,
  findActiveProductById
} from "@/modules/client/products/product.repo";



export const getProductsService = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const category = query.category;
  const search = query.search;

  return await findProducts({ page, limit, category, search,isActive:true });
};

export const getProductByIdService = async (id: string) => {
  const product = await findActiveProductById(id);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};
