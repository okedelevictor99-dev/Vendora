
import { AppError } from "@/utils/appError";
import crypto from 'crypto'
import axios from "axios";


export const generateReference = (prefix: string = "ORD"): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};



export const initializePaystackTransaction = async (
  email: string,
  amount: number,
  reference: string
) => {
  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email,
      amount: Math.round(amount * 100),
      reference,
      callback_url: `${process.env.CLIENT_URL}/dashboard/payment/verify`,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data;
};

export type PaystackVerifyResult = "success" | "failed" | "inconclusive";

export const verifyPaystackPayment = async (
  reference: string
): Promise<PaystackVerifyResult> => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const status = response.data?.data?.status;

    if (status === "success") return "success";
    if (status === "failed") return "failed";

    return "inconclusive";

  } catch (err) {
    return "inconclusive";
  }
};


export const verifyPaystackSignature =
  (rawBody:Buffer, signature: string) => {
    const secret =
      process.env.PAYSTACK_SECRET_KEY!;

    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      throw new AppError(
        "Invalid webhook signature",
        401
      );
    }
  };


