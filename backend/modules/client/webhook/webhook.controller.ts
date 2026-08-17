import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendResponse } from "@/utils/response";

import { verifyPaystackSignature } from "@/utils/paystack";
import { successWorker, failureWorker } from "@/modules/client/webhook/webhook.services";
import { AppError } from "@/utils/appError";

export const paystackWebhookController = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-paystack-signature"] as string;
  if (!signature) throw new AppError("Missing Paystack signature", 400);

  const rawBody = req.rawBody;
  if (!Buffer.isBuffer(rawBody)) throw new AppError("Invalid raw body format", 400);

  verifyPaystackSignature(rawBody, signature);

  let event;
  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    throw new AppError("Invalid JSON payload from Paystack", 400);
  }

  const { event: eventType, data } = event;
  const reference = data?.reference;
  if (!reference) throw new AppError("No reference found in payload", 400);

  sendResponse(res, 200, "Webhook received");

  void (async () => {
    try {
      if (eventType === "charge.success") {
        await successWorker(reference);
      } else if (eventType === "charge.failed") {
        await failureWorker(reference);
      }
    } catch (err) {
      console.error(err);
    }
  })();
});