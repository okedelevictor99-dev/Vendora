import { client } from "@/api-setup/client";
import type { ApiResponse } from "@/app/response";
import type {
  UserProfile,
  ChangeNamePayload,
  ChangeEmailPayload,
  VerifyChangeEmailPayload,
  ChangePasswordPayload,
  ResendChangeEmailOtpPayload
} from "@/features/client/user/user.type";

export const getUserProfile = async () => {
  const { data } = await client.get<ApiResponse<UserProfile>>("/user");
  return data.data;
};

export const changeName = async (payload: ChangeNamePayload) => {
  const { data } = await client.patch<ApiResponse<UserProfile>>("/user/change-name", payload);
  return data.data;
};

export const changeEmail = async (payload: ChangeEmailPayload) => {
  const { data } = await client.patch<ApiResponse>("/user/change-email", payload);
  return data;
};

export const verifyChangeEmail = async (payload: VerifyChangeEmailPayload) => {
  const { data } = await client.post<ApiResponse>("/user/verify-email-change", payload);
  return data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await client.patch<ApiResponse>("/user/change-password", payload);
  return data;
};
export const resendChangeEmailOtp = async (payload: ResendChangeEmailOtpPayload) => {
  const { data } = await client.post<ApiResponse>("/user/resend-email-change-otp", payload);
  return data;
};