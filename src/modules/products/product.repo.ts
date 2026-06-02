import { Product, IProduct } from "../../models/product.model";
import mongoose from "mongoose";

/* =========================
   ➕ CREATE PRODUCT
========================= */
export const createProduct = (data: Partial<IProduct>) => {
  return Product.create(data);
};

/* =========================
   📥 GET ALL PRODUCTS
========================= */


export const findProducts = async (params: {
  page: number;
  limit: number;
  category?: string;
  search?: string;
}) => {
  const { page, limit, category, search } = params;

  const skip = (page - 1) * limit;

  const filter: any = { isActive: true };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/* =========================
   📥 GET PRODUCT BY ID
========================= */



/* =========================
   ✏️ UPDATE PRODUCT
========================= */
export const updateProductById = (id: string, data: Partial<IProduct>) => {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};
export const findProductById = (id: string) => {
  return Product.findById(id);
};
/* =========================
   🗑 DELETE PRODUCT
========================= */
export const deleteProductById = (id: string) => {
  return Product.findByIdAndDelete(id);
};

export const findProductsByIds = async (
  ids: string[]
): Promise<IProduct[]> => {
  return Product.find({
    _id: { $in: ids },
    isActive: true,
  });
};

/* =========================
   🔒 RESERVE STOCK (ATOMIC)
========================= */

export const reserveStock = async (
  productId: string,
  qty: number,
  session: mongoose.ClientSession
): Promise<IProduct | null> => {
  return Product.findOneAndUpdate(
    {
      _id: productId,
      $expr: {
        $gte: [
          { $subtract: ["$stock", "$reservedStock"] },
          qty,
        ],
      },
    },
    {
      $inc: { reservedStock: qty },
    },
    {
      new: true,
      session,
    }
  );
};

/* =========================
   🔓 RELEASE STOCK
========================= */

export const releaseStock = async (
  productId: string,
  qty: number,
  session?: mongoose.ClientSession
) => {
  return Product.updateOne(
    { _id: productId },
    {
      $inc: { reservedStock: -qty },
    },
    { session }
  );
};