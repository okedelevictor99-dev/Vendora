import { adminClient } from "@/api-setup/adminClient";
import type { ApiResponse } from "@/app/response";
import type {
  AdminLoginPayload,
  AdminLoginResponseData,
  SendAdminVerificationPayload,
  ResendAdminVerificationPayload,
  AdminSignupPayload,
  Admin,
  AdminForgotPasswordPayload,
  ResendAdminForgotPasswordTokenPayload,
  AdminResetPasswordPayload,
  AdminRefreshTokenResponseData,
} from "@/features/admin/auth/auth.type";

export const sendAdminVerification = async (payload: SendAdminVerificationPayload) => {
  const { data } = await adminClient.post<ApiResponse>(
    "/admin/send-verification-token",
    payload
  );
  return data;
};

export const resendAdminVerification = async (payload: ResendAdminVerificationPayload) => {
  const { data } = await adminClient.post<ApiResponse>(
    "/admin/resend-verification-token",
    payload
  );
  return data;
};

export const adminSignup = async (payload: AdminSignupPayload) => {
  const { data } = await adminClient.post<ApiResponse<Admin>>(
    "/admin/signup",
    payload
  );
  return data;
};

export const adminLogin = async (payload: AdminLoginPayload) => {
  const { data } = await adminClient.post<ApiResponse<AdminLoginResponseData>>(
    "/admin/login",
    payload
  );
  return data;
};

export const adminLogout = async () => {
  const { data } = await adminClient.post<ApiResponse>("/admin/logout");
  return data;
};

export const adminForgotPassword = async (payload: AdminForgotPasswordPayload) => {
  const { data } = await adminClient.post<ApiResponse>(
    "/admin/forgot-password",
    payload
  );
  return data;
};

export const resendAdminForgotPassword = async (payload: ResendAdminForgotPasswordTokenPayload) => {
  const { data } = await adminClient.post<ApiResponse>(
    "/admin/resend-forgot-password-token",
    payload
  );
  return data;
};

export const adminResetPassword = async (payload: AdminResetPasswordPayload) => {
  const { data } = await adminClient.post<ApiResponse>(
    "/admin/reset-password",
    payload
  );
  return data;
};

export const restoreAdminSession = async () => {
  const { data } = await adminClient.post<ApiResponse<AdminRefreshTokenResponseData>>(
    "/admin/refresh-token"
  );
  return data;
};