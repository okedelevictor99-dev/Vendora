import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userApi from "@/features/client/user/user.api";

import type {
  ChangeNamePayload,
  ChangeEmailPayload,
  VerifyChangeEmailPayload,
  ChangePasswordPayload,
  ResendChangeEmailOtpPayload
} from "@/features/client/user/user.type";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: userApi.getUserProfile,
  });
};

export const useChangeName = () => {
  const queryClient = useQueryClient();
  // const { user, setUser } = useAuthContext();

  return useMutation({
    mutationFn: (payload: ChangeNamePayload) => userApi.changeName(payload),
    onSuccess: () => {
    queryClient.invalidateQueries({
    queryKey: ["user", "profile"],
  });
}
  });
};

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: (payload: ChangeEmailPayload) => userApi.changeEmail(payload),
  });
};

export const useVerifyChangeEmail = () => {
  const queryClient = useQueryClient();
  // const { user, setUser } = useAuthContext();

  return useMutation({
    mutationFn: (payload: VerifyChangeEmailPayload) => userApi.verifyChangeEmail(payload),
    onSuccess: () => {
    queryClient.invalidateQueries({
    queryKey: ["user", "profile"],
  });
}
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => userApi.changePassword(payload),
  });
};
export const useResendChangeEmailOtp = () => {
  return useMutation({
    mutationFn: (payload: ResendChangeEmailOtpPayload) => userApi.resendChangeEmailOtp(payload),
  });
};