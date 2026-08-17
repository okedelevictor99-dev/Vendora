import { Request, Response } from "express";

import { asyncHandler } from "@/utils/asyncHandler";
import { sendResponse } from "@/utils/response";
import { AppError } from "@/utils/appError";

import {
  signupService,
  verifyEmailService,
  resendVerificationTokenService,
  loginService,
  refreshTokenService,
  logoutService,
  logoutAllService,
  forgotPasswordService,
  resendForgotPasswordTokenService,
  resetPasswordService,
} from "@/modules/client/auth/auth.services";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.validatedBody;
  await signupService({ name, email, password });
  return sendResponse(res, 201, "Account created successfully. Please check your email for the verification code.");
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, token } = req.validatedBody;
  await verifyEmailService(email, token);
  return sendResponse(res, 200, "Email verified successfully. You can now log in.");
});

export const resendVerificationToken = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.validatedBody;
  await resendVerificationTokenService(email);
  return sendResponse(res, 200, "A new verification code has been sent to your email.");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.validatedBody;

  const result = await loginService({
    email,
    password,
    deviceInfo: req.get("user-agent"),
    ip: req.ip,
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, 200, "Login successful", { user: result.user, accessToken: result.accessToken, role:"user"});
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new AppError("No refresh token provided", 401);

  const tokens = await refreshTokenService(refreshToken);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, 200, "Token refreshed successfully", { accessToken: tokens.accessToken, id:tokens.id, role:tokens.role, name:tokens.name, email:tokens.email});
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new AppError("No refresh token provided", 400);

  await logoutService(refreshToken);
  res.clearCookie("refreshToken");

  return sendResponse(res, 200, "Logged out successfully");
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  await logoutAllService(userId);
  return sendResponse(res, 200, "Logged out from all devices successfully");
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.validatedBody;
  await forgotPasswordService(email);
  return sendResponse(res, 200, "Password reset code sent successfully");
});

export const resendForgotPasswordToken = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.validatedBody;
  await resendForgotPasswordTokenService(email);
  return sendResponse(res, 200, "New password reset code sent successfully");
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.validatedBody;
  await resetPasswordService(email, token, newPassword);
  return sendResponse(res, 200, "Password reset successfully");
});