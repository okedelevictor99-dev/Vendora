import mongoose from "mongoose";
import { Payment, IPayment } from "../../models/payment.model";

/* =========================
   PAYMENT QUERIES
========================= */

export const createPayment = async (
  data: Partial<IPayment>,
  session?: mongoose.ClientSession
): Promise<IPayment> => {
  const [payment] = await Payment.create([data], { session });
  return payment;
};

export const findPaymentByOrderId = async (
  orderId: string
): Promise<IPayment | null> => {
  return Payment.findOne({ order: orderId });
};

export const findPaymentByIdempotencyKey = async (
  key: string
): Promise<IPayment | null> => {
  return Payment.findOne({ idempotencyKey: key });
};

export const findPaymentByReference = async (
  reference: string
): Promise<IPayment | null> => {
  return Payment.findOne({ reference });
};

/* =========================
   STATUS UPDATES
========================= */

export const updatePaymentStatusToSuccess = async (
  reference: string,
  session?: mongoose.ClientSession
) => {
  return Payment.updateOne(
    {
      reference,
      status: { $in: ["pending", "failed_candidate"] },
    },
    { $set: { status: "success" } },
    { session }
  );
};

export const updatePaymentStatusToFailedCandidate = async (
  reference: string,
  session?: mongoose.ClientSession
) => {
  return Payment.updateOne(
    { reference, status: "pending" },
    { $set: { status: "failed_candidate" } },
    { session }
  );
};

export const updatePaymentStatusToFailedFinal = async (
  reference: string,
  session?: mongoose.ClientSession
) => {
  return Payment.updateOne(
    { reference, status: "failed_candidate" },
    { $set: { status: "failed_final" } },
    { session }
  );
};

export const revokeToken = async (hashed: string) => {
  return Payment.findOneAndDelete({ refreshToken: hashed });
};