import { Product, IProduct } from "../../models/product.model";

export const createProduct = (data: Partial<IProduct>) => {
  return Product.create(data);
};
export const findProducts = async (params: {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  isActive?:boolean
}) => {
  const { page, limit, category, search,isActive} = params;

  const skip = (page - 1) * limit;

  const filter: any = {}
  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

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

export const updateProductById = (id: string, data: Partial<IProduct>) => {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};
export const findProductById = (id: string) => {
  return Product.findById(id);
};

export const deactivateProductById = (id: string) => {
  return Product.findOneAndUpdate(
    {
      _id: id,
      isActive: true,
    },
    {
      isActive: false,
    },
    {
      new: true,
    }
  );
};

export const activateProductById = (id: string) => {
  return Product.findOneAndUpdate(
    {
      _id: id,
      isActive: false,
    },
    {
      isActive: true,
    },
    {
      new: true,
    }
  );
};
export const findActiveProductById = (id: string) => {
  return Product.findOne({
    _id: id,
    isActive: true,
  });
};

export const findProductsByIds = async (
  ids: string[]
): Promise<IProduct[]> => {
  return Product.find({
    _id: { $in: ids },
    isActive: true,
  });
};


