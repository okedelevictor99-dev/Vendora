import mongoose, { Schema, Document } from "mongoose";

export interface IAdminToken extends Document {
  adminId: mongoose.Types.ObjectId;

  refreshToken: string;

  deviceInfo?: string;
  ip?: string;

  isValid: boolean;

  expiresAt: Date;
}

const adminTokenSchema = new Schema<IAdminToken>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },

    deviceInfo: {
      type: String,
    },

    ip: {
      type: String,
    },

    isValid: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   AUTO DELETE EXPIRED TOKENS
========================= */

adminTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const AdminToken = mongoose.model<IAdminToken>(
  "AdminToken",
  adminTokenSchema
);