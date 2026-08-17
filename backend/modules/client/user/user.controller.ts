// user.controller.ts

import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendResponse } from "@/utils/response";

import {
  changeNameService, changePasswordService,changeEmailService,verifyChangeEmailService,getUserProfileService,resendChangeEmailOtpService
} from "@/modules/client/user/user.services";

export const changeName = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.validatedBody;
  const { userId } = req.user!;

  const user = await changeNameService(userId, name);

  return sendResponse(res, 200, "Name updated successfully", {
    user,
  });
});


export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.validatedBody;
  const { userId } = req.user!;

  await changePasswordService(userId, currentPassword, newPassword);

  return sendResponse(res, 200, "Password updated successfully");
});
export const changeEmail = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newEmail } = req.validatedBody;
  const { userId } = req.user!;

  await changeEmailService(userId, currentPassword, newEmail);

  return sendResponse(
    res,
    200,
    "Verification code sent to new email. Please confirm to complete email change."
  );
});
export const resendChangeEmailOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  await resendChangeEmailOtpService(email);

  return sendResponse(
    res,
    200,
    "Verification code sent successfully"
  );
});
export const verifyChangeEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, token } = req.validatedBody;

  await verifyChangeEmailService(email, token);

  return sendResponse(res, 200, "Email updated successfully");
});
export const getUserProfile = asyncHandler(async (req:Request, res:Response) => {
  const { userId } = req.user!;

  const user = await getUserProfileService(userId);

  return sendResponse(res, 200, "User profile fetched successfully", user);
});