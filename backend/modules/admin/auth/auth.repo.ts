import mongoose from "mongoose";

import { Admin, IAdmin } from "../../../models/admin.model";
import {
  AdminToken,
  IAdminToken,
} from "../../../models/admin.token.model";


export const createAdmin = async (
  data: Partial<IAdmin>
): Promise<IAdmin> => {
  return Admin.create(data);
};

export const findAdminByEmail = async (
  email: string,
  includePassword = false
): Promise<IAdmin | null> => {
  const query = Admin.findOne({ email });

  if (includePassword) {
    query.select("+password");
  }

  return query;
};

export const findAdminById = async (
  id: string,
  includePassword = false
): Promise<IAdmin | null> => {
  if (includePassword) {
    return Admin.findById(id).select("+password");
  }

  return Admin.findById(id);
};

export const findAdminByVerificationToken = async (
  email: string,
  token: string
): Promise<IAdmin | null> => {
  return Admin.findOne({
    email,
    emailVerificationToken: token,
    emailVerificationExpires: {
      $gt: new Date(),
    },
  });
};

export const saveAdmin = async (
  admin: IAdmin
): Promise<IAdmin> => {
  return admin.save();
};

export const updateAdminById = async (
  id: string,
  update: Partial<IAdmin>
): Promise<IAdmin | null> => {
  return Admin.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
};


export const saveAdminRefreshToken = async (
  data: {
    adminId: mongoose.Types.ObjectId;
    refreshToken: string;
    deviceInfo?: string;
    ip?: string;
    expiresAt: Date;
  }
): Promise<IAdminToken> => {
  return AdminToken.create(data);
};

export const findAdminToken = async (
  refreshToken: string
): Promise<IAdminToken | null> => {
  return AdminToken.findOne({
    refreshToken,
    isValid: true,
    expiresAt: {
      $gt: new Date(),
    },
  });
};

export const revokeAdminToken = async (
  refreshToken: string
): Promise<IAdminToken | null> => {
  return AdminToken.findOneAndUpdate(
    {
      refreshToken,
      isValid: true,
    },
    {
      isValid: false,
    },
    {
      new: true,
    }
  );
};

export const revokeAllAdminTokens = async (
  adminId: string
) => {
  return AdminToken.updateMany(
    {
      adminId,
      isValid: true,
    },
    {
      isValid: false,
    }
  );
};