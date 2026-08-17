import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

import { useManualVerifyOrder } from "@/features/client/order/order.hook";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/pageTransition";
import ShopNavbar from "@/components/ui/shopNavbar";
import type { OrderStatus } from "@/features/client/order/order.type";

const Spinner = () => (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
  />
);

const PaymentVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  const { verifyOrder, isVerifying } = useManualVerifyOrder();

  const [result, setResult] = useState<{
    status: OrderStatus | "initiated";
    message?: string;
  } | null>(null);
  const [errored, setErrored] = useState(false);

  const hasAutoVerified = useRef(false);

  const runVerify = async () => {
    if (!reference) return;
    setErrored(false);
    try {
      const data = await verifyOrder(reference);
      setResult(data);
    } catch {
      setErrored(true);
    }
  };

  useEffect(() => {
    if (hasAutoVerified.current) return;
    hasAutoVerified.current = true;
    runVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!reference) {
    return (
      <PageTransition>
        <ShopNavbar />
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <XCircle className="mx-auto h-14 w-14 text-red-500" />
          <h1 className="mt-6 font-serif text-2xl text-[#14151A]">
            Missing payment reference
          </h1>
          <p className="mt-2 text-sm text-[#8B8B85]">
            We couldn't find a payment reference in this link.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/dashboard/orders">
              <Button className="min-w-52">View my orders</Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <ShopNavbar />
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        {isVerifying && !result && (
          <>
            <div className="flex justify-center text-[#E8682F]">
              <Spinner />
            </div>
            <h1 className="mt-6 font-serif text-2xl text-[#14151A]">
              Confirming your payment...
            </h1>
            <p className="mt-2 text-sm text-[#8B8B85]">
              Hang tight, this only takes a moment.
            </p>
          </>
        )}

        {errored && !isVerifying && (
          <>
            <XCircle className="mx-auto h-14 w-14 text-red-500" />
            <h1 className="mt-6 font-serif text-2xl text-[#14151A]">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-[#8B8B85]">
              We couldn't confirm your payment status right now.
            </p>
            <Button onClick={runVerify} className="mt-8 min-w-52">
              Try again
            </Button>
          </>
        )}

        {result && !isVerifying && result.status === "paid" && (
          <>
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
            <h1 className="mt-6 font-serif text-2xl text-[#14151A]">
              Payment successful
            </h1>
            <p className="mt-2 text-sm text-[#8B8B85]">
              Your order has been confirmed.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/dashboard/orders">
                <Button className="min-w-52">View my orders</Button>
              </Link>
            </div>
          </>
        )}

        {result && !isVerifying && result.status === "failed" && (
          <>
            <XCircle className="mx-auto h-14 w-14 text-red-500" />
            <h1 className="mt-6 font-serif text-2xl text-[#14151A]">
              Payment failed
            </h1>
            <p className="mt-2 text-sm text-[#8B8B85]">
              Your payment could not be completed. No charge was made to your order.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/dashboard/cart">
                <Button className="min-w-52">Back to cart</Button>
              </Link>
            </div>
          </>
        )}

        {result && !isVerifying && result.status === "initiated" && (
          <>
            <Clock className="mx-auto h-14 w-14 text-[#E8682F]" />
            <h1 className="mt-6 font-serif text-2xl text-[#14151A]">
              Payment still pending
            </h1>
            <p className="mt-2 text-sm text-[#8B8B85]">
              {result.message ?? "We haven't received confirmation yet. This can take a minute."}
            </p>
            <Button onClick={runVerify} className="mt-8 min-w-52">
              Verify again
            </Button>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default PaymentVerifyPage;