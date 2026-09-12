import { Request, Response } from "express";

import { asyncHandler } from "@/utils/asyncHandler";
import { sendResponse } from "@/utils/response";
import { AppError } from "@/utils/appError";

import {
  sendAdminVerificationService,
  resendAdminVerificationService,
  adminSignupService,
  adminLoginService,
  adminRefreshTokenService,
  adminLogoutService,
  adminForgotPasswordService,
  resendAdminForgotPasswordService,
  adminResetPasswordService,
} from "@/modules/admin/auth/auth.service";

export const sendAdminVerification = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.validatedBody;

  await sendAdminVerificationService({ name, email });

  return sendResponse(
    res,
    201,
    "Admin invitation sent successfully"
  );
});

export const resendAdminVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.validatedBody;

  await resendAdminVerificationService(email);

  return sendResponse(
    res,
    200,
    "Verification code resent"
  );
});

export const adminSignup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, token } = req.validatedBody;

  const admin = await adminSignupService({
    email,
    password,
    token,
  });

  return sendResponse(
    res,
    201,
    "Admin account created successfully",
    admin
  );
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.validatedBody;

  const result = await adminLoginService({
    email,
    password,
    deviceInfo: req.get("user-agent"),
    ip: req.ip,
  });

  res.cookie("adminRefreshToken", result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(
    res,
    200,
    "Login successful",
    {
      admin: result.admin,
      accessToken: result.accessToken,
      role:result.admin.role
    }
  );
});

export const adminRefreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.adminRefreshToken;
   console.log(
    "[AUTH] Refresh token cookie exists:",
    !!refreshToken
  );

  if (!refreshToken) {
    throw new AppError(
      "No refresh token provided",
      401
    );
  }

  const tokens = await adminRefreshTokenService(refreshToken);

  res.cookie("adminRefreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(
    res,
    200,
    "Token refreshed",
    {
      accessToken: tokens.accessToken,
      id:tokens.id,
      role:tokens.role,
      name:tokens.name,
      email:tokens.email
    }
  );
});

export const adminLogout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.adminRefreshToken;

  if (!refreshToken) {
    throw new AppError(
      "No refresh token",
      400
    );
  }

  await adminLogoutService(refreshToken);

  res.clearCookie("adminRefreshToken");

  return sendResponse(
    res,
    200,
    "Logged out successfully"
  );
});

export const adminForgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.validatedBody;

  await adminForgotPasswordService(email);

  return sendResponse(
    res,
    200,
    "Reset code sent to email"
  );
});

export const resendAdminForgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.validatedBody;

  await resendAdminForgotPasswordService(email);

  return sendResponse(
    res,
    200,
    "New reset code sent"
  );
});

export const adminResetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.validatedBody;

  await adminResetPasswordService(
    email,
    token,
    newPassword
  );

  return sendResponse(
    res,
    200,
    "Password reset successful"
  );
});