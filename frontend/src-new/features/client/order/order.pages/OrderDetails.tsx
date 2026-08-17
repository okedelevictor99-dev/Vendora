import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

import { useUserOrder, useManualVerifyOrder } from "@/features/client/order/order.hook";
import { useToast } from "@/context/toastContext";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/pageTransition";
import ShopNavbar from "@/components/ui/shopNavbar";
import type { OrderStatus } from "@/features/client/order/order.type";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(price);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

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

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: order, isLoading, error, refetch } = useUserOrder(id || "");
  const { verifyOrder, isVerifying } = useManualVerifyOrder();

  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!order) return;
    setPendingMessage(null);
    try {
      const result = await verifyOrder(order.reference);
      if (result.status === "initiated") {
        setPendingMessage(result.message ?? "Payment still pending, please try again shortly");
      } else {
        await refetch();
      }
    } catch {
      showToast("Couldn't verify payment right now");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-start justify-center pt-20">
        <p className="text-lg font-medium text-gray-600">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return <div className="p-6">Order not found</div>;
  }

  return (
    <PageTransition>
      <ShopNavbar />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <button type="button" onClick={() => navigate(-1)} className="text-sm text-[#8B8B85] hover:text-[#14151A]">
          ← Back
        </button>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl text-[#14151A]">{order.reference}</h1>
            <p className="mt-1 text-sm text-[#8B8B85]">Placed {formatDate(order.createdAt)}</p>
          </div>
          <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        {order.status === "initiated" && (
          <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#E8682F]" />
              <div>
                <p className="text-sm font-medium text-[#14151A]">This order is awaiting payment confirmation</p>
                {pendingMessage && <p className="mt-1 text-sm text-[#8B8B85]">{pendingMessage}</p>}
              </div>
            </div>
            <Button onClick={handleVerify} isLoading={isVerifying} className="min-w-40">
              Verify payment
            </Button>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4">
          {order.items.map((item) => (
            <div key={item.product._id} className="flex items-center gap-4 rounded-2xl border border-[#E5E2DA] bg-white p-4 shadow-sm">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#F5F3EE]">
                {item.product.images?.[0] && (
                  <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#14151A]">{item.product.name}</p>
                <p className="mt-1 text-sm text-[#8B8B85]">Qty {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <p className="font-serif text-lg text-[#14151A]">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between rounded-2xl border border-[#E5E2DA] bg-[#FAF8F3] p-6">
          <p className="text-sm text-[#8B8B85]">Total</p>
          <p className="font-serif text-2xl text-[#14151A]">{formatPrice(order.totalAmount)}</p>
        </div>
      </div>
    </PageTransition>
  );
};

export default OrderDetails;