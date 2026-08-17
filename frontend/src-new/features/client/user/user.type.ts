export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeNamePayload {
  name: string;
}

export interface ChangeEmailPayload {
  currentPassword: string;
  newEmail: string;
}

export interface VerifyChangeEmailPayload {
  email: string;
  token: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
export interface ResendChangeEmailOtpPayload {
  email: string;
}