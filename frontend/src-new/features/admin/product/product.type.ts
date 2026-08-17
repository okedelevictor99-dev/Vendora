export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  reservedStock: number;
  category: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface AdminProductListParams extends ProductListParams {
  status?: "active" | "inactive";
}

export interface ProductListData {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images?: string[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
  isActive?: boolean;
}