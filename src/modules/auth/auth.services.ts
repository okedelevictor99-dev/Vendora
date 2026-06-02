import mongoose from 'mongoose';
import crypto from 'crypto';

import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByVerificationToken,
  saveUser,
  saveRefreshToken,
  findToken,
  revokeToken,
  revokeAllUserTokens,
} from '../auth/auth.repo';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';

import { sendEmail } from '../../utils/email';
import { AppError } from '../../utils/appError';

// ----------------------
// HELPERS
// ----------------------

const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const refreshTokenExpiry = (): Date => {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};

// ----------------------
// SIGNUP
// ----------------------

export const signupService = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError('Email already exists', 400);
  }

  const rawVerificationToken = generateOTP();
  const hashedVerificationToken = hashToken(rawVerificationToken);

  const user = await createUser({
    name: data.name,
    email: data.email,
    password: data.password,
    isEmailVerified: false,
    emailVerificationToken: hashedVerificationToken,
    emailVerificationExpires: new Date(Date.now() + 60 * 60 * 1000),
  });

  await sendEmail({
    to: user.email,
    subject: 'Verify Your Email',
    html: `
      <h2>Email Verification</h2>
      <p>Hello ${user.name},</p>
      <p>Your verification code is:</p>
      <h1>${rawVerificationToken}</h1>
      <p>This code will expire in 1 hour.</p>
    `,
  });

  return user;
};

// ----------------------
// VERIFY EMAIL
// ----------------------

export const verifyEmailService = async (
  email: string,
  token: string
) => {
  const hashedToken = hashToken(token);

  const user = await findUserByVerificationToken(email, hashedToken);

  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email already verified', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;

  await saveUser(user);

  return user;
};

// ----------------------
// RESEND VERIFICATION TOKEN
// ----------------------

export const resendVerificationTokenService = async (
  email: string
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email already verified', 400);
  }

  const rawVerificationToken = generateOTP();

  user.emailVerificationToken = hashToken(rawVerificationToken);
  user.emailVerificationExpires = new Date(
    Date.now() + 60 * 60 * 1000
  );

  await saveUser(user);

  await sendEmail({
    to: user.email,
    subject: 'New Verification Code',
    html: `
      <h2>Email Verification</h2>
      <p>Hello ${user.name},</p>
      <p>Your new verification code is:</p>
      <h1>${rawVerificationToken}</h1>
      <p>This code will expire in 1 hour.</p>
    `,
  });
};

// ----------------------
// LOGIN
// ----------------------

export const loginService = async (data: {
  email: string;
  password: string;
  deviceInfo?: string;
  ip?: string;
}) => {
  const user = await findUserByEmail(data.email, true);

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await user.comparePassword(data.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError('Please verify your email before logging in', 403);
  }

  const payload = { userId: user._id.toString() };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await saveRefreshToken({
    userId: new mongoose.Types.ObjectId(user._id),
    refreshToken: hashToken(refreshToken),
    deviceInfo: data.deviceInfo,
    ip: data.ip,
    expiresAt: refreshTokenExpiry(),
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    },
    accessToken,
    refreshToken,
  };
};


// ----------------------
// REFRESH TOKEN
// ----------------------

export const refreshTokenService = async (
  refreshToken: string
) => {
  const decoded = verifyRefreshToken(refreshToken);
  const hashed = hashToken(refreshToken);

  const existingToken = await findToken(hashed);

  if (!existingToken) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  if (!decoded.userId) {
  throw new AppError("Invalid token", 401);
}


  const user = await findUserById(decoded.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await revokeToken(hashed);

  const newAccessToken = generateAccessToken({
    userId: user._id.toString(),
  });

  const newRefreshToken = generateRefreshToken({
    userId: user._id.toString(),
  });

  await saveRefreshToken({
    userId: new mongoose.Types.ObjectId(user._id),
    refreshToken: hashToken(newRefreshToken),
    deviceInfo: existingToken.deviceInfo,
    ip: existingToken.ip,
    expiresAt: refreshTokenExpiry(),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// ----------------------
// LOGOUT (CURRENT DEVICE)
// ----------------------

export const logoutService = async (
  refreshToken: string
) => {
   const hashed = hashToken(refreshToken);
  const token = await revokeToken(hashed);

  if (!token) {
    throw new AppError('Invalid refresh token', 400);
  }
};

// ----------------------
// LOGOUT ALL DEVICES
// ----------------------

export const logoutAllService = async (
  userId: string
) => {
  await revokeAllUserTokens(userId);
};

// ----------------------
// FORGOT PASSWORD
// ----------------------

export const forgotPasswordService = async (email: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const rawResetToken = generateOTP();

  user.passwordResetToken = hashToken(rawResetToken);
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

  await saveUser(user);

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Code',
    html: `
      <h2>Password Reset Request</h2>
      <p>Your password reset code is:</p>
      <h1>${rawResetToken}</h1>
      <p>This code expires in 1 hour.</p>
    `,
  });
};

// ----------------------
// RESEND PASSWORD RESET TOKEN
// ----------------------

export const resendForgotPasswordTokenService = async (
  email: string
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const rawResetToken = generateOTP();

  user.passwordResetToken = hashToken(rawResetToken);
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

  await saveUser(user);

  await sendEmail({
    to: user.email,
    subject: 'New Password Reset Code',
    html: `
      <h2>Password Reset Request</h2>
      <p>Your new password reset code is:</p>
      <h1>${rawResetToken}</h1>
      <p>This code expires in 1 hour.</p>
    `,
  });
};

// ----------------------
// RESET PASSWORD
// ----------------------

export const resetPasswordService = async (
  email: string,
  token: string,
  newPassword: string
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const hashedToken = hashToken(token);

  if (
    user.passwordResetToken !== hashedToken ||
    !user.passwordResetExpires ||
    user.passwordResetExpires < new Date()
  ) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await saveUser(user);
};
