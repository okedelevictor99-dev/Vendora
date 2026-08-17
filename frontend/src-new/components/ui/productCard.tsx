import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuthContext } from "@/context/authContext";
import { useToast } from "@/context/toastContext";
import { useCart } from "@/features/client/cart/cart.hook";
import { Button } from "@/components/ui/button";
import type { Product } from "@/features/client/product/product.type";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(price);

export const ProductCard = ({ product }: { product: Product }) => {
  const { isAuthenticated } = useAuthContext();
  const { showToast } = useToast();
  const { addToCart, isAddingToCart } = useCart();
  const navigate=useNavigate()

  const availableStock = product.stock - product.reservedStock;
  const isOutOfStock = availableStock <= 0;
  const location=useLocation()
  const isOnDashboard = location.pathname.startsWith("/dashboard");

  const handleAddToCart = async () => {
  if (!isAuthenticated) {
    showToast("Please log in to add items to your cart.", "Log in", "/login");
    return;
  }

try {
  await addToCart({ productId: product._id, quantity: 1 });
  showToast(`${product.name} added to your cart.`);
  if (!isOnDashboard) {
    navigate("/dashboard");
  }
} catch {
  showToast("Couldn't add this item. Please try again.");
}
};
const productLink = isOnDashboard
  ? `/dashboard/products/${product._id}`
  : `/products/${product._id}`;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#E5E2DA] bg-white">
     <motion.div
  whileHover={{ y: -9 }}
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  <Link
    to={productLink}
    className="block aspect-square overflow-hidden rounded-t-lg bg-[#F0EDE6]"
  >
    {product.images[0] ? (
      <img
        src={product.images[0]}
        alt={product.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full items-center justify-center text-xs text-[#8B8B85]">
        No image
      </div>
    )}
  </Link>
</motion.div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link to={productLink} className="line-clamp-1 text-sm font-medium text-[#14151A] hover:text-[#E8682F]">
          {product.name}
        </Link>
        <p className="text-sm font-semibold text-[#14151A]">{formatPrice(product.price)}</p>

        {isOutOfStock && (
          <p className="text-xs text-red-500">Out of stock</p>
        )}

        <motion.div
          whileHover={isOutOfStock ? undefined : { y: -1 }}
          whileTap={isOutOfStock ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="mt-2"
        >
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            isLoading={isAddingToCart}
            className="w-full whitespace-nowrap text-xs sm:text-sm"
          >
            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};