import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { checkoutService,manualVerifyOrderService,getUserOrderByIdService,getUserOrdersService} from "@/modules/client/order/order.service";
import { sendResponse } from "@/utils/response";


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



