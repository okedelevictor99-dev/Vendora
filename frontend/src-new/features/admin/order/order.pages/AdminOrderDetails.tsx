import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import { useAdminOrder, useAdminOrderMutations } from "@/features/admin/order/order.hook";
import {
  refundOrderSchema,
  type RefundOrderFormValues,
} from "@/features/admin/order/order.validation";
import type { OrderStatus } from "@/features/admin/order/order.type";
import { ConfirmDialog } from "@/components/ui/confirmModal";
import { Button } from "@/components/ui/button";
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
    hour: "2-digit",
    minute: "2-digit",
  });

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

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [confirmAction, setConfirmAction] = useState<"ship" | "deliver" | null>(null);
  const [showRefundForm, setShowRefundForm] = useState(false);

  const { data, isLoading } = useAdminOrder(id ?? "");
  const {
    shipOrder,
    deliverOrder,
    refundOrder,
    isShippingOrder,
    isDeliveringOrder,
    isRefundingOrder,
    refundOrderError,
  } = useAdminOrderMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RefundOrderFormValues>({
    resolver: zodResolver(refundOrderSchema),
  });

  const order = data?.data?.order;
  console.log("RAW DATA:", data);

  if (isLoading) {
    return <p className="py-10 text-center text-sm text-[#8B8B85]">Loading order...</p>;
  }

  if (!order) {
    return (
      <div className="rounded-xl border border-dashed border-[#E5E2DA] bg-white py-12 text-center">
        <p className="text-[#8B8B85]">Order not found.</p>
        <Link to="/admin/orders" className="mt-3 inline-block text-sm font-medium text-[#E8682F] hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction === "ship") {
        await shipOrder(order.reference);
        showToast(`Order ${order.reference} marked as shipped`);
      } else {
        await deliverOrder(order.reference);
        showToast(`Order ${order.reference} marked as delivered`);
      }
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setConfirmAction(null);
    }
  };

  const onSubmitRefund = async (values: RefundOrderFormValues) => {
    try {
      await refundOrder({ reference: order.reference, payload: { note: values.note } });
      showToast(`Order ${order.reference} has been refunded`);
      setShowRefundForm(false);
      reset();
    } catch {
      // error handled below via refundOrderError
    }
  };

  const refundErrorMessage =
    (isAxiosError(refundOrderError) && refundOrderError.response?.data?.message) || undefined;

  const canShip = order.status === "paid";
  const canDeliver = order.status === "shipped";
  const canRefund = order.status === "cannot_fulfill" && order.refundStatus === "pending";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="text-sm font-medium text-[#8B8B85] hover:text-[#14151A]"
        >
          ← Back to orders
        </button>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl text-[#14151A]">{order.reference}</h1>
            <p className="mt-1 text-sm text-[#8B8B85]">Placed {formatDate(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Customer */}
      <div className="rounded-xl border border-[#E5E2DA] bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8B8B85]">Customer</h2>
        <p className="mt-2 font-medium text-[#14151A]">{order.user.name}</p>
        <p className="text-sm text-[#8B8B85]">{order.user.email}</p>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-[#E5E2DA] bg-white">
        <h2 className="border-b border-[#E5E2DA] px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#8B8B85]">
          Items
        </h2>

        <div className="divide-y divide-[#E5E2DA]">
          {order.items.map((item, idx) => (
            <div key={`${item.product._id}-${idx}`} className="flex gap-4 px-6 py-4">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-[#F0EDE6]">
                {item.product.images[0] && (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#14151A]">{item.product.name}</p>
                    <p className="text-sm text-[#8B8B85]">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>

                  <p className="font-medium text-[#14151A] sm:flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[#E5E2DA] px-6 py-4">
          <span className="font-medium text-[#14151A]">Total</span>
          <span className="font-serif text-lg text-[#14151A]">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {/* Refund info, only if relevant */}
      {order.refundStatus !== "none" && (
        <div className="rounded-xl border border-[#E5E2DA] bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8B8B85]">Refund</h2>
          <p className="mt-2 text-sm capitalize text-[#14151A]">
            Status: <span className="font-medium">{order.refundStatus}</span>
          </p>
          {order.refundNote && (
            <p className="mt-1 text-sm text-[#8B8B85]">Note: {order.refundNote}</p>
          )}
          {order.refundedAt && (
            <p className="mt-1 text-sm text-[#8B8B85]">Refunded on {formatDate(order.refundedAt)}</p>
          )}
        </div>
      )}

      {/* Actions */}
      {(canShip || canDeliver || canRefund) && (
        <div className="rounded-xl border border-[#E5E2DA] bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8B8B85]">Actions</h2>

          <div className="mt-4 flex flex-wrap gap-3">
            {canShip && (
              <Button type="button" onClick={() => setConfirmAction("ship")}>
                Mark as Shipped
              </Button>
            )}

            {canDeliver && (
              <Button type="button" onClick={() => setConfirmAction("deliver")}>
                Mark as Delivered
              </Button>
            )}

            {canRefund && !showRefundForm && (
              <Button type="button" variant="secondary" onClick={() => setShowRefundForm(true)}>
                Process Refund
              </Button>
            )}
          </div>

          {canRefund && showRefundForm && (
            <form onSubmit={handleSubmit(onSubmitRefund)} className="mt-4 flex flex-col gap-3">
              <div>
                <label htmlFor="note" className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
                  Refund note (optional)
                </label>
                <textarea
                  id="note"
                  rows={3}
                  className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#14151A] outline-none focus:border-[#E8682F] ${
                    errors.note ? "border-red-400" : "border-[#E5E2DA]"
                  }`}
                  {...register("note")}
                />
                {errors.note && (
                  <p className="mt-1 text-xs text-red-500">{errors.note.message}</p>
                )}
              </div>

              {refundErrorMessage && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {refundErrorMessage}
                </p>
              )}

              <div className="flex gap-3">
                <Button type="submit" isLoading={isRefundingOrder} className="flex-1 sm:flex-none">
                  Confirm Refund
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowRefundForm(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmAction}
        title={confirmAction === "ship" ? "Mark order as shipped?" : "Mark order as delivered?"}
        message={
          confirmAction === "ship"
            ? `Order ${order.reference} will be marked as shipped.`
            : `Order ${order.reference} will be marked as delivered.`
        }
        confirmLabel={confirmAction === "ship" ? "Mark Shipped" : "Mark Delivered"}
        isLoading={isShippingOrder || isDeliveringOrder}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
};

export default AdminOrderDetails;