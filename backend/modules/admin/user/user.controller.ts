import { asyncHandler } from "@/utils/asyncHandler";
import { Response, Request } from "express";
import { sendResponse } from "@/utils/response";
import { getAdminUsersService, getAdminUserByIdService, deleteUserService } from "./user.service";

export const getAdminUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getAdminUsersService(req.query);

    return sendResponse(
      res,
      200,
      "Users fetched successfully",
      result
    );
  }
);

export const getAdminUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams;
  const user = await getAdminUserByIdService(id);
  return sendResponse(res, 200, "User fetched successfully", user);
});

export const deleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.validatedParams;
    const result = await deleteUserService(id);

    return sendResponse(
      res,
      200,
      "User deleted successfully",
      result
    );
  }
);