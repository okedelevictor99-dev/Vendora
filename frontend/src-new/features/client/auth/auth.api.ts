import { client } from "@/api-setup/client";
import type { ApiResponse } from "@/app/response";
import type {
  LoginPayload,
  LoginResponseData,
  SignupPayload,
  User,
  VerifyEmailPayload,
  ResendVerificationTokenPayload,
  ForgotPasswordPayload,
  ResendForgotPasswordTokenPayload,
  ResetPasswordPayload,
  RefreshTokenResponseData
} from "@/features/client/auth/auth.type";

export const signup = async (payload: SignupPayload) => {
  const { data } = await client.post<ApiResponse<User>>("/auth/signup", payload);
  return data;
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const { data } = await client.post<ApiResponse>("/auth/verify-email", payload);
  return data;
};

export const resendVerificationToken = async (payload: ResendVerificationTokenPayload) => {
  const { data } = await client.post<ApiResponse>("/auth/resend-verification-token", payload);
  return data;
};

export const login = async (payload: LoginPayload) => {
  const { data } = await client.post<ApiResponse<LoginResponseData>>("/auth/login", payload);
  return data;
};

export const logout = async () => {
  const { data } = await client.post<ApiResponse>("/auth/logout");
  return data;
};

export const logoutAll = async () => {
  const { data } = await client.post<ApiResponse>("/auth/logout-all");
  return data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await client.post<ApiResponse>("/auth/forgot-password", payload);
  return data;
};

export const resendForgotPasswordToken = async (payload: ResendForgotPasswordTokenPayload) => {
  const { data } = await client.post<ApiResponse>("/auth/resend-forgot-password-token", payload);
  return data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await client.post<ApiResponse>("/auth/reset-password", payload);
  return data;
};
export const restoreSession = async () => {
  const { data } = await client.post<ApiResponse<RefreshTokenResponseData>>("/auth/refresh-token");
  return data;
};