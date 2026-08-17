

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";

import { useCart } from "@/features/client/cart/cart.hook";
import { useToast } from "@/context/toastContext";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/features/client/order/order.hook";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);

const Spinner = () => (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{
      repeat: Infinity,
      duration: 0.8,
      ease: "linear",
    }}
    className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
  />
);

const Cart = () => {
  const {
    cart,
    isLoadingCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  
const { checkout, isCheckingOut } = useCheckout();

  const { showToast } = useToast();

  const [loadingAction, setLoadingAction] = useState<{
    id?: string;
    type: "increase" | "decrease" | "remove" | "clear";
  } | null>(null);

  const isLoading = loadingAction !== null || isCheckingOut;
  const handleCheckout = async () => {
  try {
    const { paymentUrl } = await checkout();
    window.location.href = paymentUrl;
  } catch {
    showToast("Failed to start checkout");
  }
};

  const handleIncrease = async (id: string) => {
    try {
      setLoadingAction({
        id,
        type: "increase",
      });

      await increaseQuantity(id);

      showToast("Item added successfully");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDecrease = async (id: string) => {
    try {
      setLoadingAction({
        id,
        type: "decrease",
      });

      await decreaseQuantity(id);

      showToast("Item quantity has been updated");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      setLoadingAction({
        id,
        type: "remove",
      });

      await removeFromCart(id);

      showToast("Item removed from cart");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleClear = async () => {
    try {
      setLoadingAction({
        type: "clear",
      });

      await clearCart();

      showToast("Cart cleared");
    } finally {
      setLoadingAction(null);
    }
  };

  if (isLoadingCart) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="flex justify-center">
          <Spinner />
        </div>

        <p className="mt-4 text-sm text-[#8B8B85]">
          Loading your cart...
        </p>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-serif text-3xl text-[#14151A]">
          Your cart is empty
        </h1>

        <p className="mt-3 text-sm text-[#8B8B85]">
          Looks like you haven't added anything yet.
        </p>

        <div className="mt-8 flex justify-center">
          <Link to="/dashboard">
            <Button className="min-w-52">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl text-[#14151A]">
          Your Cart
        </h1>

        <Button
          variant="secondary"
          onClick={handleClear}
          disabled={isLoading}
          isLoading={loadingAction?.type === "clear"}
          className="border border-red-200 bg-white text-red-600 hover:bg-red-50"
        >
          Clear Cart
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        {items.map((item) => (
          <motion.div
            layout
            key={item.product.id}
            className="rounded-2xl border border-[#E5E2DA] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

              {/* Product */}

              <div className="flex flex-1 items-center gap-4">

                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#F5F3EE]">
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-[#14151A]">
                    {item.product.name}
                  </h2>

                  <p className="mt-1 text-sm text-[#8B8B85]">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
              </div>

              {/* Controls */}

              <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">

                <div className="flex items-center overflow-hidden rounded-xl border border-[#E5E2DA]">

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleDecrease(item.product.id)}
                    className="
  flex h-10 w-10 items-center justify-center
  bg-[#F5F3EE]
  shadow-sm
  transition-all duration-200
  hover:-translate-y-0.5
  hover:shadow-lg
  active:translate-y-0
  active:scale-95
  disabled:cursor-not-allowed
  disabled:opacity-40
"
                  >
                    {loadingAction?.id === item.product.id &&
                    loadingAction.type === "decrease" ? (
                      <Spinner />
                    ) : (
                      <span className="text-lg font-medium">−</span>
                    )}
                  </button>

                  <span className="flex h-10 w-12 items-center justify-center bg-white text-sm font-semibold text-[#14151A]">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleIncrease(item.product.id)}
                    className="
  flex h-10 w-10 items-center justify-center
  bg-[#F5F3EE]
  shadow-sm
  transition-all duration-200
  hover:-translate-y-0.5
  hover:shadow-lg
  active:translate-y-0
  active:scale-95
  disabled:cursor-not-allowed
  disabled:opacity-40
"
                  >
                    {loadingAction?.id === item.product.id &&
                    loadingAction.type === "increase" ? (
                      <Spinner />
                    ) : (
                      <span className="text-lg font-medium">+</span>
                    )}
                  </button>
                </div>
                  <motion.p
                    key={item.subtotal}
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="min-w-[110px] text-right font-serif text-lg text-[#14151A]"
                  >
                    {formatPrice(item.subtotal)}
                  </motion.p>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleRemove(item.product.id)}
                    aria-label="Remove item"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-red-200
                      text-red-500
                      transition-all
                      hover:bg-red-50
                      hover:border-red-300
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    {loadingAction?.id === item.product.id &&
                    loadingAction.type === "remove" ? (
                      <Spinner />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>

                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Summary */}

      <motion.div
        layout
        className="mt-10 rounded-2xl border border-[#E5E2DA] bg-[#FAF8F3] p-6 shadow-sm"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm text-[#8B8B85]">
              Total Items
            </p>

            <p className="mt-1 text-xl font-semibold text-[#14151A]">
              {cart?.totalQuantity} item
              {cart?.totalQuantity === 1 ? "" : "s"}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm text-[#8B8B85]">
              Subtotal
            </p>

            <motion.p
              key={cart?.subtotal}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="mt-1 font-serif text-3xl text-[#14151A]"
            >
              {formatPrice(cart?.subtotal ?? 0)}
            </motion.p>
          </div>

        </div>

        <Button
  className="mt-8 w-full py-4 text-base"
  onClick={handleCheckout}
  disabled={isLoading || isCheckingOut}
  isLoading={isCheckingOut}
>
  Proceed to Checkout
</Button>
      </motion.div>
    </div>
  );
};

export default Cart;

