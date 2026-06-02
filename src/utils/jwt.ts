import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import {StringValue} from 'ms'
import { AppError } from './appError';

// ----------------------
// TYPES
// ----------------------
export interface JwtPayload {
  userId?: string;
  adminId?:string
  role?:"user"|"admin"|"super-admin"

}

// ----------------------
// ACCESS TOKEN
// ----------------------
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as StringValue,
  });
};

// ----------------------
// REFRESH TOKEN
// ----------------------
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as StringValue,
  });
};

// ----------------------
// VERIFY ACCESS TOKEN
// ----------------------


const safeVerify = (token: string, secret: string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};

export const verifyAccessToken = (token: string) =>
  safeVerify(token, env.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token: string) =>
  safeVerify(token, env.JWT_REFRESH_SECRET);