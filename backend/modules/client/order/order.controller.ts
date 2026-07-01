import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { checkoutService,manualVerifyOrderService,markOrderRefundedService,getUserOrderByIdService,getAdminOrderByIdService,getUserOrdersService,getAdminOrdersService,markOrderAsDeliveredService,markOrderAsShippedService} from "./order.service";
import { sendResponse } from "../../utils/response";


export const checkout = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const { paymentUrl, reference } = await checkoutService(userId);

    return sendResponse(res, 200, "Order initiated", {
      paymentUrl,
      reference,
    });
  }
);


export const manualVerifyOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { reference } = req.validatedParams;

    const result = await manualVerifyOrderService(reference, userId);

    return sendResponse(res, 200, "Order status retrieved", result);
  }
);



export const markOrderRefunded = asyncHandler(
  async (req: Request, res: Response) => {
    const { reference } = req.validatedParams;
    const { note } = req.body;

    const order = await markOrderRefundedService(reference, note);

    return sendResponse(res, 200, "Order marked as refunded", order.refundStatus);
  }
);




export const getUserOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const {userId} = req.user!
    const { page, limit } = req.validatedQuery;

    const { orders, meta } = await getUserOrdersService(userId, {
      page,
      limit,
    });

    sendResponse(res, 200, "Orders fetched successfully.", { orders, meta });
  }
);

export const getUserOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const {userId} = req.user!;
    const { id } = req.validatedParams;

    const order = await getUserOrderByIdService(id, userId);

    sendResponse(res, 200, "Order fetched successfully.", { order });
  }
);



export const getAdminOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, status, refundStatus } = req.validatedQuery;

    const { orders, meta } = await getAdminOrdersService(
      { page, limit },
      { status, refundStatus }
    );

    sendResponse(res, 200, "Orders fetched successfully.", { orders, meta });
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