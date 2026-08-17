import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendResponse } from "@/utils/response";

import {
  changeAdminNameService,
  getAdminProfileService,
} from "@/modules/admin/account/account.servics";

export const changeAdminName = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.validatedBody;
    const { adminId } = req.admin!;

    const admin = await changeAdminNameService(adminId, name);

    return sendResponse(res, 200, "Name updated successfully", {
      admin,
    });
  }
);


export const getAdminProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminId } = req.admin!;

    const admin = await getAdminProfileService(adminId);

    return sendResponse(res, 200, "Admin profile fetched successfully", admin);
  }
);