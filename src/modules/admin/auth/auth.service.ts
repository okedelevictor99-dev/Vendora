import crypto from "crypto";
import mongoose from "mongoose";

import {
  createAdmin,
  findAdminByEmail,
  saveAdmin,
  findAdminByVerificationToken,
  findAdminById,
  saveAdminRefreshToken,
  findAdminToken,
  revokeAdminToken,
  revokeAllAdminTokens,
} from "./auth.repo";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt";

import { sendEmail } from "../../../utils/email";
import { AppError } from "../../../utils/appError";

/* =========================
   🔐 HELPERS
========================= */

const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

const hashToken = (token: string): string => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};
const refreshTokenExpiry = (): Date => {
  return new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );
};

/* =========================
   📧 SEND VERIFY EMAIL
   (SUPERADMIN ONLY)
========================= */

export const sendAdminVerificationService =
  async (
    data: {
      name: string;
      email: string;
    }
  ) => {
    const existingAdmin =
      await findAdminByEmail(data.email);

    if (existingAdmin) {
      throw new AppError(
        "Admin already exists",
        400
      );
    }

    // generate token
    const rawToken = generateOTP();

    const hashedToken =
      hashToken(rawToken);

    // create admin
    const admin = await createAdmin({
      name: data.name,
      email: data.email,

      // temporary password
      password: crypto.randomBytes(16).toString(
        "hex"
      ),

      isEmailVerified: false,

      emailVerificationToken:
        hashedToken,

      emailVerificationExpires:
        new Date(
          Date.now() + 60 * 60 * 1000
        ),
    });

    await sendEmail({
      to: admin.email,
      subject: "Admin Invitation",

      html: `
        <h2>Admin Account Invitation</h2>

        <p>Hello ${admin.name},</p>

        <p>
          You have been invited as an admin.
        </p>

        <p>Your verification code is:</p>

        <h1>${rawToken}</h1>

        <p>
          This code expires in 1 hour.
        </p>
      `,
    });

    return admin;
  };

/* =========================
   🔄 RESEND VERIFY TOKEN
   (SUPERADMIN ONLY)
========================= */

export const resendAdminVerificationService =
  async (email: string) => {
    const admin =
      await findAdminByEmail(email);

    if (!admin) {
      throw new AppError(
        "Admin not found",
        404
      );
    }

    if (admin.isEmailVerified) {
      throw new AppError(
        "Admin already verified",
        400
      );
    }

    const rawToken = generateOTP();

    admin.emailVerificationToken =
      hashToken(rawToken);

    admin.emailVerificationExpires =
      new Date(
        Date.now() + 60 * 60 * 1000
      );

    await saveAdmin(admin);

    await sendEmail({
      to: admin.email,

      subject: "New Admin Verification Code",

      html: `
        <h2>Admin Verification</h2>

        <p>Hello ${admin.name},</p>

        <p>Your new verification code is:</p>

        <h1>${rawToken}</h1>

        <p>
          This code expires in 1 hour.
        </p>
      `,
    });
  };
  export const adminSignupService = async (
  data: {
    email: string;
    password: string;
    token: string;
  }
) => {
  const hashedToken = hashToken(
    data.token
  );

  const admin =
    await findAdminByVerificationToken(
      data.email,
      hashedToken
    );

  if (!admin) {
    throw new AppError(
      "Invalid or expired verification token",
      400
    );
  }

  if (admin.isEmailVerified) {
    throw new AppError(
      "Admin already verified",
      400
    );
  }

  // set real password
  admin.password = data.password;

  // activate account
  admin.isEmailVerified = true;

  // clear verification fields
  admin.emailVerificationToken = null;

  admin.emailVerificationExpires = null;

  await saveAdmin(admin);

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
};


/* =========================
   🔐 HELPERS
========================= */


/* =========================
   🔑 ADMIN LOGIN
========================= */

export const adminLoginService = async (
  data: {
    email: string;
    password: string;
    deviceInfo?: string;
    ip?: string;
  }
) => {
  const admin =
    await findAdminByEmail(
      data.email,
      true
    );

  if (!admin) {
    throw new AppError(
      "Invalid credentials",
      401
    );
  }

  const isPasswordValid =
    await admin.comparePassword(
      data.password
    );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid credentials",
      401
    );
  }

  if (!admin.isEmailVerified) {
    throw new AppError(
      "Please complete signup first",
      403
    );
  }

  /* =========================
     SINGLE DEVICE LOGIN
  ========================= */

  await revokeAllAdminTokens(
    admin._id.toString()
  );

  /* =========================
     GENERATE TOKENS
  ========================= */

  const payload = {
    adminId: admin._id.toString(),
    role: admin.role,
  };

  const accessToken =
    generateAccessToken(payload);

  const refreshToken =
    generateRefreshToken(payload);

  await saveAdminRefreshToken({
    adminId: new mongoose.Types.ObjectId(
      admin._id
    ),

    refreshToken:
      hashToken(refreshToken),

    deviceInfo: data.deviceInfo,

    ip: data.ip,

    expiresAt: refreshTokenExpiry(),
  });

  return {
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },

    accessToken,
    refreshToken,
  };
};

/* =========================
   🔄 REFRESH TOKEN
========================= */

export const adminRefreshTokenService =
  async (refreshToken: string) => {
     const decoded = verifyRefreshToken(refreshToken);
 
    const hashed =
      hashToken(refreshToken);

    const existingToken =
      await findAdminToken(hashed);

    if (!existingToken) {
      throw new AppError(
        "Invalid or expired refresh token",
        401
      );
    }

    const admin =
      await findAdminById(
        existingToken.adminId.toString()
      );

    if (!admin) {
      throw new AppError(
        "Admin not found",
        404
      );
    }

    // rotate token
    await revokeAdminToken(hashed);

    const payload = {
      adminId: admin._id.toString(),
      role: admin.role,
    };

    const newAccessToken =
      generateAccessToken(payload);

    const newRefreshToken =
      generateRefreshToken(payload);

    await saveAdminRefreshToken({
      adminId: new mongoose.Types.ObjectId(
        admin._id
      ),

      refreshToken:
        hashToken(newRefreshToken),

      deviceInfo:
        existingToken.deviceInfo,

      ip: existingToken.ip,

      expiresAt: refreshTokenExpiry(),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  };

/* =========================
   🚪 LOGOUT
========================= */

export const adminLogoutService =
  async (refreshToken: string) => {
    const hashed =
      hashToken(refreshToken);

    const token =
      await revokeAdminToken(hashed);

    if (!token) {
      throw new AppError(
        "Invalid refresh token",
        400
      );
    }
  };

  export const adminForgotPasswordService =
  async (email: string) => {
    const admin =
      await findAdminByEmail(email);

    if (!admin) {
      throw new AppError(
        "Admin not found",
        404
      );
    }

    const rawToken = generateOTP();

    admin.passwordResetToken =
      hashToken(rawToken);

    admin.passwordResetExpires =
      new Date(
        Date.now() + 60 * 60 * 1000
      );

    await saveAdmin(admin);

    await sendEmail({
      to: admin.email,
      subject:
        "Admin Password Reset Code",

      html: `
        <h2>Password Reset Request</h2>

        <p>Hello ${admin.name},</p>

        <p>
          Use the code below to reset your password:
        </p>

        <h1>${rawToken}</h1>

        <p>
          This code expires in 1 hour.
        </p>

        <p>
          If you did not request this, ignore this email.
        </p>
      `,
    });

    return {
      message:
        "Reset code sent to email",
    };
  };

  export const resendAdminForgotPasswordService =
  async (email: string) => {
    const admin =
      await findAdminByEmail(email);

    if (!admin) {
      throw new AppError(
        "Admin not found",
        404
      );
    }

    const rawToken = generateOTP();

    admin.passwordResetToken =
      hashToken(rawToken);

    admin.passwordResetExpires =
      new Date(
        Date.now() + 60 * 60 * 1000
      );

    await saveAdmin(admin);

    await sendEmail({
      to: admin.email,
      subject:
        "New Password Reset Code",

      html: `
        <h2>New Reset Code</h2>

        <p>Hello ${admin.name},</p>

        <p>Your new reset code is:</p>

        <h1>${rawToken}</h1>

        <p>Expires in 1 hour.</p>
      `,
    });

    return {
      message:
        "New reset code sent",
    };
  };
  export const adminResetPasswordService =
  async (
    email: string,
    token: string,
    newPassword: string
  ) => {
    const admin =
      await findAdminByEmail(email);

    if (!admin) {
      throw new AppError(
        "Admin not found",
        404
      );
    }

    const hashedToken =
      hashToken(token);

    const isValid =
      admin.passwordResetToken ===
        hashedToken &&
      admin.passwordResetExpires &&
      admin.passwordResetExpires >
        new Date();

    if (!isValid) {
      throw new AppError(
        "Invalid or expired reset token",
        400
      );
    }

    admin.password = newPassword;

    admin.passwordResetToken = null;
    admin.passwordResetExpires = null;

    await saveAdmin(admin);

    return {
      message:
        "Password reset successful",
    };
  };