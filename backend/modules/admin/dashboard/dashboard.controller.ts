import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import { sendResponse } from "@/utils/response";
import { getDashboardStatsService } from "./dashboard.service";

export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await getDashboardStatsService();
    return sendResponse(res, 200, "Dashboard stats fetched successfully", stats);
  }
);