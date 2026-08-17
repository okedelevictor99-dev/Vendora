import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/features/client/product/product.hook";
import { useCart } from "@/features/client/cart/cart.hook";
import { useToast } from "@/context/toastContext";
import { useAuthContext } from "@/context/authContext";
import { PageTransition } from "@/components/layout/pageTransition";
import ShopNavbar from "@/components/ui/shopNavbar";


const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const location=useLocation()
  const navigate=useNavigate()
  const { data: product, isLoading, error } = useProduct(id || "");

  const { addToCart, isAddingToCart } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuthContext();
  const isOnDashboard = location.pathname.startsWith("/dashboard");

 if (isLoading) {
  return (
    <div className="flex h-[70vh] items-start justify-center pt-20">
      <p className="text-lg font-medium text-gray-600">
        Loading product...
      </p>
    </div>
  );
}
  if (error || !product) {
    return <div className="p-6">Product not found</div>;
  }

  const availableStock = product.stock - product.reservedStock;
  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast("Please log in to continue", "Log in", "/login");
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
      });

      showToast(`${product.name} added to cart`);
      if (!isOnDashboard) {
    navigate("/dashboard");
  }
    } catch {
      showToast("Failed to add to cart");
    }
  };

  return (
    <PageTransition>
      <ShopNavbar/>
  <div className="mx-auto max-w-6xl px-4 py-8">
    
    <div className="grid gap-10 md:grid-cols-2">

      {/* IMAGE SECTION */}
      <div className="rounded-2xl bg-white p-2 shadow-md">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="h-full w-full rounded-md object-cover"
          />
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="flex flex-col gap-5 mt-4">

        {/* NAME */}
        <h1 className="text-3xl font-bold tracking-tight text-[#14151A]">
          {product.name}
        </h1>

        {/* PRICE */}
        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold text-[#E8682F]">
            {formatPrice(product.price)}
          </p>

          <span className="rounded-full bg-[#F0EDE6] px-3 py-1 text-xs font-medium text-gray-600">
            Best Price
          </span>
        </div>

        {/* META INFO */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span className="rounded-full bg-gray-100 px-3 py-1">
            Category: {product.category}
          </span>

          <span
            className={`rounded-full px-3 py-1 ${
              product.stock - product.reservedStock > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {product.stock - product.reservedStock > 0
              ? `In stock (${product.stock - product.reservedStock})`
              : "Out of stock"}
          </span>
        </div>

        {/* DESCRIPTION */}
        <div className="rounded-xl bg-[#FAF8F4] p-5">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            Description
          </h3>

          <p className="text-base leading-relaxed text-gray-700">
            {product.description}
          </p>
        </div>

        {/* ACTION BUTTON */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          isLoading={isAddingToCart}
         className="mt-2 w-full rounded-xl bg-[#E8682F] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d95f25] md:text-base"
        >
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </div>
  </div>
  </PageTransition>
);
};
export default ProductDetailsPage