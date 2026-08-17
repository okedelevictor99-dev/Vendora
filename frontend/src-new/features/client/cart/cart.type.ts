
export interface CartItemProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  isActive: boolean;
}

export interface CartItem {
  product: CartItemProduct;
  quantity: number;
  subtotal: number;
}

export interface CartData {
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
}