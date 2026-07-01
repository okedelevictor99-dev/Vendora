import mongoose from "mongoose";
import {
  findOrderByReference,
  deductReservedStock,
  fulfillFromAvailableStock,
  markOrderAsPaid,
  releaseReservedStock,
  markOrderAsFailed,
} from "../order/order.repo";
import { Order } from "../../models/order.model";

export const successWorker = async (reference: string) => {
  const order = await findOrderByReference(reference);
  if (!order) return;
  if (order.status !== "initiated") return;

  const items = order.items.map((i) => ({ productId: i.product.toString(), quantity: i.quantity }));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (order.stockReserved) {
      const deducted = await deductReservedStock(items, order._id.toString(), session);

      if (deducted) {
        await markOrderAsPaid(reference, session);
        await session.commitTransaction();
        return;
      }

      const freshOrder = await findOrderByReference(reference, session);

      if (freshOrder && !freshOrder.stockReserved) {
        const fulfilled = await fulfillFromAvailableStock(items, session);

        if (fulfilled) {
          await markOrderAsPaid(reference, session);
          await session.commitTransaction();
          return;
        }
      }

      await session.abortTransaction();
      await handleCannotFulfill(reference);
      return;
    }

    const fulfilled = await fulfillFromAvailableStock(items, session);

    if (fulfilled) {
      await markOrderAsPaid(reference, session);
      await session.commitTransaction();
      return;
    }

    await session.abortTransaction();
    await handleCannotFulfill(reference);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const failureWorker = async (reference: string) => {
  const order = await findOrderByReference(reference);
  if (!order) return;
  if (order.status !== "initiated") return;

  const items = order.items.map((i) => ({ productId: i.product.toString(), quantity: i.quantity }));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (order.stockReserved) await releaseReservedStock(items, order._id.toString(), session);

    await markOrderAsFailed(reference, session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const handleCannotFulfill = async (reference: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Order.findOneAndUpdate(
      { reference, status: "initiated" },
      { $set: { status: "cannot_fulfill", refundStatus: "pending" } },
      { session }
    );
    await session.commitTransaction();
  } catch {
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
};