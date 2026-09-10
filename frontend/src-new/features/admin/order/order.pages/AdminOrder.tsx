import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  useAdminOrders,
  useAdminOrderMutations,
} from "@/features/admin/order/order.hook";
import { useDebounce } from "@/hooks/useBounce";
import { ConfirmDialog } from "@/components/ui/confirmModal";
import { Button } from "@/components/ui/button";
import type { Order, OrderStatus } from "@/features/admin/order/order.type";
import { useToast } from "@/context/toastContext";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const statusFilters: { label: string; value: OrderStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Initiated", value: "initiated" },
  { label: "Paid", value: "paid" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Failed", value: "failed" },
  { label: "Cannot Fulfill", value: "cannot_fulfill" },
];

const statusStyles: Record<OrderStatus, string> = {
  initiated: "bg-[#F0EDE6] text-[#8B8B85]",
  paid: "bg-blue-50 text-blue-700",
  shipped: "bg-amber-50 text-amber-700",
  delivered: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-600",
  cannot_fulfill: "bg-red-50 text-red-600",
};

const StatusBadge = ({ status }: { status: OrderStatus }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
  >
    {status.replace("_", " ")}
  </span>
);

type PendingAction = { order: Order; action: "ship" | "deliver" } | null;

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = (searchParams.get("status") ?? "") as OrderStatus | "";

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const { showToast } = useToast();

  const { data, isLoading, isFetching } = useAdminOrders({
    page,
    limit: 10,
    search: debouncedSearch,
    status: status || undefined,
  });

  const { shipOrder, deliverOrder, isShippingOrder, isDeliveringOrder } =
    useAdminOrderMutations();

  const orders = data?.data.orders ?? [];
  const totalPages = data?.data.totalPages ?? 1;

  const updateStatus = (value: string) => {
  const next = new URLSearchParams(searchParams);

  if (value) {
    next.set("status", value);
  } else {
    next.delete("status");
  }

  setPage(1);
  setSearch(""); // Clear search when changing status
  setSearchParams(next);
};

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    const { order, action } = pendingAction;

    try {
      if (action === "ship") {
        await shipOrder(order.reference);
        showToast(`Order ${order.reference} marked as shipped`);
      } else {
        await deliverOrder(order.reference);
        showToast(`Order ${order.reference} marked as delivered`);
      }
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setPendingAction(null);
    }
  };

  const renderQuickAction = (order: Order) => {
    if (order.status === "paid") {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPendingAction({ order, action: "ship" });
          }}
          className="font-medium text-[#E8682F] hover:underline"
        >
          Mark Shipped
        </button>
      );
    }

    if (order.status === "shipped") {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPendingAction({ order, action: "deliver" });
          }}
          className="font-medium text-[#E8682F] hover:underline"
        >
          Mark Delivered
        </button>
      );
    }

    return <span className="text-[#8B8B85]">—</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-[#14151A]">Orders</h1>
        <p className="mt-1 text-sm text-[#8B8B85]">
          View and manage customer orders.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => updateStatus(filter.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                status === filter.value
                  ? "bg-[#E8682F] text-white"
                  : "border border-[#E5E2DA] bg-white text-[#8B8B85] hover:bg-[#F7F4EE]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-[#E5E2DA] bg-white py-2.5 pl-4 pr-10 text-sm outline-none transition focus:border-[#E8682F]"
          />

          {isFetching && search.trim().length > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E8682F] border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-[#8B8B85]">
          Loading orders...
        </p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E5E2DA] bg-white py-12 text-center">
          <p className="text-[#8B8B85]">No orders found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl border border-[#E5E2DA] bg-white md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#FAF8F4] text-xs uppercase tracking-wide text-[#8B8B85]">
                  <tr className="border-b border-[#E5E2DA]">
                    <th className="px-6 py-4 font-semibold">Reference</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Items</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="cursor-pointer border-b border-[#E5E2DA] transition hover:bg-[#FCFBF8] last:border-none"
                    >
                      <td className="px-6 py-4">
                        <Link to={`/admin/orders/${order._id}`} className="font-medium text-[#14151A]">
                          {order.reference}
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <Link to={`/admin/orders/${order._id}`} className="block">
                          <p className="font-medium text-[#14151A]">{order.user.name}</p>
                          <p className="text-xs text-[#8B8B85]">{order.user.email}</p>
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <Link to={`/admin/orders/${order._id}`}>{order.items.length}</Link>
                      </td>

                      <td className="px-6 py-4 font-medium">
                        <Link to={`/admin/orders/${order._id}`}>
                          {formatPrice(order.totalAmount)}
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-6 py-4 text-[#8B8B85]">
                        <Link to={`/admin/orders/${order._id}`}>
                          {formatDate(order.createdAt)}
                        </Link>
                      </td>

                      <td className="px-6 py-4">{renderQuickAction(order)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/admin/orders/${order._id}`}
                className="block w-full max-w-full rounded-xl border border-[#E5E2DA] bg-white"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[#14151A]">{order.reference}</p>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-[70px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
                    <span className="text-[#8B8B85]">Customer</span>
                    <span className="font-medium break-words text-[#14151A]">
                      {order.user.name}
                    </span>

                    <span className="text-[#8B8B85]">Items</span>
                    <span className="font-medium text-[#14151A]">{order.items.length}</span>

                    <span className="text-[#8B8B85]">Total</span>
                    <span className="font-medium text-[#14151A]">
                      {formatPrice(order.totalAmount)}
                    </span>

                    <span className="text-[#8B8B85]">Date</span>
                    <span className="text-[#8B8B85]">{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                {(order.status === "paid" || order.status === "shipped") && (
                  <div className="border-t border-[#E5E2DA]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPendingAction({
                          order,
                          action: order.status === "paid" ? "ship" : "deliver",
                        });
                      }}
                      className="w-full py-3 text-center text-sm font-medium text-[#E8682F] transition hover:bg-[#F8F5EF]"
                    >
                      {order.status === "paid" ? "Mark Shipped" : "Mark Delivered"}
                    </button>
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 border-t border-[#E5E2DA] pt-6 sm:flex-row">
            <Button
              type="button"
              variant="primary"
              className="px-3 py-2 text-sm sm:px-4 sm:py-2.5"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <div className="text-sm text-[#8B8B85]">
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </div>

            <Button
              type="button"
              variant="primary"
              className="px-3 py-2 text-sm sm:px-4 sm:py-2.5"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={!!pendingAction}
        title={
          pendingAction?.action === "ship" ? "Mark order as shipped?" : "Mark order as delivered?"
        }
        message={
          pendingAction?.action === "ship"
            ? `Order ${pendingAction?.order.reference} will be marked as shipped.`
            : `Order ${pendingAction?.order.reference} will be marked as delivered.`
        }
        confirmLabel={pendingAction?.action === "ship" ? "Mark Shipped" : "Mark Delivered"}
        isLoading={isShippingOrder || isDeliveringOrder}
        onConfirm={handleConfirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
};

export default AdminOrders;