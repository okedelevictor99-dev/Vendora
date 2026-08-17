import { asyncHandler } from "@/utils/asyncHandler";
import { Request,Response } from "express";
import { sendResponse } from "@/utils/response";
import { getAdminOrdersService,getAdminOrderByIdService,markOrderAsDeliveredService,markOrderAsShippedService,markOrderRefundedService } from "./order.service";



export const getAdminOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, status, refundStatus, search } = req.validatedQuery;

    const { orders, meta } = await getAdminOrdersService(
      {
        page,
        limit,
        search,
      },
      {
        status,
        refundStatus,
      }
    );

    sendResponse(res, 200, "Orders fetched successfully.", {
      orders,
      meta,
    });
  }
);

export const getAdminOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.validatedParams;

    const order = await getAdminOrderByIdService(id);

    sendResponse(res, 200, "Order fetched successfully.", { order });
  }
);




export const markOrderAsShipped = asyncHandler(
  async (req: Request, res: Response) => {
    const { reference } = req.validatedParams;

    const order = await markOrderAsShippedService(reference);

    sendResponse(res, 200, "Order marked as shipped.", { order });
  }
);

export const markOrderAsDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const { reference } = req.validatedParams;

    const order = await markOrderAsDeliveredService(reference);

    sendResponse(res, 200, "Order marked as delivered.", { order });
  }
);

export const markOrderRefunded = asyncHandler(
  async (req: Request, res: Response) => {
    const { reference } = req.validatedParams;
    const { note } = req.body;

    const order = await markOrderRefundedService(reference, note);

    return sendResponse(res, 200, "Order marked as refunded", {order});
  }
);
