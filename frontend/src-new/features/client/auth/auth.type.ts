export type UserRole = "user";

export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string,
  role:UserRole
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  token: string;
}

export interface ResendVerificationTokenPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResendForgotPasswordTokenPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  id: string;
  role: UserRole;
  name:string
  email:string
}