import { findUserById, saveUser, findUserByPendingEmail } from "../auth/auth.repo";
import { AppError } from "../../utils/appError";
import { sendEmail } from "../../utils/email";
import crypto from "crypto";

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

export const changeNameService = async (userId: string, name: string) => {
  const user = await findUserById(userId);
  if (!user) throw new AppError("User not found", 404);

  user.name = name;
  await saveUser(user);

  return { id: user._id, name: user.name, email: user.email };
};

export const changePasswordService = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await findUserById(userId, true);
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError("Current password is incorrect", 403);

  const isSameAsCurrent = await user.comparePassword(newPassword);
  if (isSameAsCurrent) throw new AppError("New password cannot be the same as current password", 400);

  user.password = newPassword;
  await saveUser(user);
};

export const changeEmailService = async (userId: string, currentPassword: string, newEmail: string) => {
  const user = await findUserById(userId, true);
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError("Incorrect password", 401);
  if (user.email === newEmail) throw new AppError("This is already your email", 400);

  const rawToken = generateOTP();
  const hashedToken = hashToken(rawToken);

  user.pendingEmail = newEmail;
  user.emailChangeToken = hashedToken;
  user.emailChangeExpires = new Date(Date.now() + 60 * 60 * 1000);
  await saveUser(user);

  await sendEmail({
    to: newEmail,
    subject: "Confirm Email Change",
    html: `
      <h2>Email Change Verification</h2>
      <p>Your verification code is:</p>
      <h1>${rawToken}</h1>
      <p>This code expires in 1 hour.</p>
    `,
  });
};

export const verifyChangeEmailService = async (email: string, token: string) => {
  const user = await findUserByPendingEmail(email);
  if (!user) throw new AppError("Invalid request", 400);

  const hashed = hashToken(token);

  if (
    user.emailChangeToken !== hashed ||
    !user.emailChangeExpires ||
    user.emailChangeExpires < new Date()
  ) {
    throw new AppError("Invalid or expired token", 400);
  }

  user.email = email;
  user.pendingEmail = null;
  user.emailChangeToken = null;
  user.emailChangeExpires = null;
  await saveUser(user);
};

export const getUserProfileService = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) throw new AppError("User not found", 404);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role:"user",
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};