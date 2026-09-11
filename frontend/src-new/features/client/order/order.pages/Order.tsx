

import { Link, useSearchParams } from "react-router-dom";

import { useUserOrders } from "@/features/client/order/order.hook";

import { Button } from "@/components/ui/button";

import { PageTransition } from "@/components/layout/pageTransition";

import ShopNavbar from "@/components/ui/shopNavbar";

import type { OrderStatus } from "@/features/client/order/order.type";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const STATUS_STYLES: Record<OrderStatus, string> = {
  initiated: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-600",
  cannot_fulfill: "bg-red-100 text-red-600",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  initiated: "Awaiting payment",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  failed: "Failed",
  cannot_fulfill: "Cannot fulfill",
};

const Order = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading, isError } = useUserOrders({
    page,
    limit: 10,
  });

  const orders = data?.orders ?? [];
  const meta = data?.meta;

  const updatePage = (next: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(next));
    setSearchParams(params);
  };

  return (
    <PageTransition>
      <ShopNavbar />

      <div className="bg-[#FAF8F4] px-6 py-12">
        <div className="mx-auto max-w-5xl">

          {/* Loading */}
          {isLoading && (
            <p className="mt-12 text-center text-sm text-[#8B8B85]">
              Loading orders...
            </p>
          )}

          {/* Error */}
          {isError && (
            <p className="mt-12 text-center text-sm text-red-500">
              Couldn't load your orders. Please try again.
            </p>
          )}

          {/* No orders */}
          {!isLoading && !isError && orders.length === 0 && (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <h1 className="font-serif text-3xl text-[#14151A]">
                No orders yet
              </h1>

              <p className="mt-3 text-sm text-[#8B8B85]">
                You haven't placed any orders yet.
              </p>

              <Link to="/dashboard">
                <Button className="mt-6 min-w-52">
                  Start shopping
                </Button>
              </Link>
            </div>
          )}

          {/* Orders */}
          {!isLoading && !isError && orders.length > 0 && (
            <>
              <h1 className="font-serif text-3xl text-[#14151A]">
                My orders
              </h1>

              <div className="mt-8 flex flex-col gap-4">
                {orders.map((order) => (
                  <Link
                    key={order._id}
                    to={`/dashboard/orders/${order._id}`}
                    className="rounded-2xl border border-[#E5E2DA] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-[#14151A]">
                          {order.reference}
                        </p>

                        <p className="mt-1 text-sm text-[#8B8B85]">
                          {formatDate(order.createdAt)} · {order.items.length}{" "}
                          item{order.items.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 sm:justify-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            STATUS_STYLES[order.status]
                          }`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>

                        <p className="font-serif text-lg text-[#14151A]">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={!meta.hasPrevPage}
                    onClick={() => updatePage(page - 1)}
                  >
                    ← Previous
                  </Button>

                  <span className="text-sm text-[#8B8B85]">
                    Page{" "}
                    <span className="font-medium text-[#14151A]">
                      {meta.page}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-[#14151A]">
                      {meta.totalPages}
                    </span>
                  </span>

                  <Button
                    type="button"
                    variant="secondary"
                    disabled={!meta.hasNextPage}
                    onClick={() => updatePage(page + 1)}
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Order;