export type AdminRole = "admin" | "super-admin";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponseData {
  admin: Admin;
  accessToken: string,
  role:AdminRole
}

export interface SendAdminVerificationPayload {
  name: string;
  email: string;
}

export interface ResendAdminVerificationPayload {
  email: string;
}

export interface AdminSignupPayload {
  email: string;
  password: string;
  token: string;
}

export interface AdminForgotPasswordPayload {
  email: string;
}

export interface ResendAdminForgotPasswordTokenPayload {
  email: string;
}

export interface AdminResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export interface AdminRefreshTokenResponseData {
  accessToken: string;
  id: string;
  role: AdminRole;
  name:string
  email:string
}