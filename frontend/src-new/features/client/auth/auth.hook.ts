
import { useMutation } from "@tanstack/react-query";

import * as authApi from "@/features/client/auth/auth.api";

import {
  setAccessToken,
  setRefreshToken,
} from "@/api-setup/client";

import { useAuthContext } from "@/context/authContext";

import type {
  LoginPayload,
  SignupPayload,
  VerifyEmailPayload,
  ResendVerificationTokenPayload,
  ForgotPasswordPayload,
  ResendForgotPasswordTokenPayload,
  ResetPasswordPayload,
} from "@/features/client/auth/auth.type";

export const useAuth = () => {
  const { setUser } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),

    onSuccess: (response) => {
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      setUser(response.data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      authApi.verifyEmail(payload),
  });

  const resendVerificationTokenMutation = useMutation({
    mutationFn: (payload: ResendVerificationTokenPayload) =>
      authApi.resendVerificationToken(payload),
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),

    onSuccess: () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    },
  });

  const logoutAllMutation = useMutation({
    mutationFn: () => authApi.logoutAll(),

    onSuccess: () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });

  const resendForgotPasswordTokenMutation = useMutation({
    mutationFn: (payload: ResendForgotPasswordTokenPayload) =>
      authApi.resendForgotPasswordToken(payload),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    signup: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,

    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,

    resendVerificationToken:
      resendVerificationTokenMutation.mutateAsync,
    isResendingVerificationToken:
      resendVerificationTokenMutation.isPending,

    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    logoutAll: logoutAllMutation.mutateAsync,
    isLoggingOutAll: logoutAllMutation.isPending,

    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingForgotPassword:
      forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,

    resendForgotPasswordToken:
      resendForgotPasswordTokenMutation.mutateAsync,
    isResendingForgotPasswordToken:
      resendForgotPasswordTokenMutation.isPending,

    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,
  };
};

