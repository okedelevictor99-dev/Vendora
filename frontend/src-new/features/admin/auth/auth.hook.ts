import { useMutation } from "@tanstack/react-query";
import * as adminAuthApi from "@/features/admin/auth/auth.api";
import { setAdminAccessToken,setAdminRefreshToken } from "@/api-setup/adminClient";
import { useAdminAuthContext } from "@/context/adminAuthContext";
import type {
  AdminLoginPayload,
  AdminSignupPayload,
  SendAdminVerificationPayload,
  ResendAdminVerificationPayload,
  AdminForgotPasswordPayload,
  ResendAdminForgotPasswordTokenPayload,
  AdminResetPasswordPayload,
} from "@/features/admin/auth/auth.type";

export const useAdminAuth = () => {
  const { setAdmin } = useAdminAuthContext();

  const adminLoginMutation = useMutation({
    mutationFn: (payload: AdminLoginPayload) => adminAuthApi.adminLogin(payload),
   onSuccess: (response) => {
  setAdminAccessToken(response.data.accessToken);
  setAdminRefreshToken(response.data.refreshToken);
  setAdmin(response.data.admin);
},
  });

  const adminSignupMutation = useMutation({
    mutationFn: (payload: AdminSignupPayload) => adminAuthApi.adminSignup(payload),
  });

  const sendAdminVerificationMutation = useMutation({
    mutationFn: (payload: SendAdminVerificationPayload) =>
      adminAuthApi.sendAdminVerification(payload),
  });

  const resendAdminVerificationMutation = useMutation({
    mutationFn: (payload: ResendAdminVerificationPayload) =>
      adminAuthApi.resendAdminVerification(payload),
  });

  const adminLogoutMutation = useMutation({
    mutationFn: () => adminAuthApi.adminLogout(),
   onSuccess: () => {
  setAdminAccessToken(null);
  setAdminRefreshToken(null);
  setAdmin(null);
},
  });

  const adminForgotPasswordMutation = useMutation({
    mutationFn: (payload: AdminForgotPasswordPayload) =>
      adminAuthApi.adminForgotPassword(payload),
  });

  const resendAdminForgotPasswordMutation = useMutation({
    mutationFn: (payload: ResendAdminForgotPasswordTokenPayload) =>
      adminAuthApi.resendAdminForgotPassword(payload),
  });

  const adminResetPasswordMutation = useMutation({
    mutationFn: (payload: AdminResetPasswordPayload) =>
      adminAuthApi.adminResetPassword(payload),
  });

  return {
    adminLogin: adminLoginMutation.mutateAsync,
    isAdminLoggingIn: adminLoginMutation.isPending,
    adminLoginError: adminLoginMutation.error,

    adminSignup: adminSignupMutation.mutateAsync,
    isAdminSigningUp: adminSignupMutation.isPending,
    adminSignupError: adminSignupMutation.error,

    sendAdminVerification: sendAdminVerificationMutation.mutateAsync,
    isSendingAdminVerification: sendAdminVerificationMutation.isPending,
    sendAdminVerificationError: sendAdminVerificationMutation.error,

    resendAdminVerification: resendAdminVerificationMutation.mutateAsync,
    isResendingAdminVerification: resendAdminVerificationMutation.isPending,
    resendAdminVerificationError: resendAdminVerificationMutation.error,

    adminLogout: adminLogoutMutation.mutateAsync,
    isAdminLoggingOut: adminLogoutMutation.isPending,

    adminForgotPassword: adminForgotPasswordMutation.mutateAsync,
    isSendingAdminForgotPassword: adminForgotPasswordMutation.isPending,
    adminForgotPasswordError: adminForgotPasswordMutation.error,

    resendAdminForgotPassword: resendAdminForgotPasswordMutation.mutateAsync,
    isResendingAdminForgotPassword: resendAdminForgotPasswordMutation.isPending,

    adminResetPassword: adminResetPasswordMutation.mutateAsync,
    isResettingAdminPassword: adminResetPasswordMutation.isPending,
    adminResetPasswordError: adminResetPasswordMutation.error,
  };
};