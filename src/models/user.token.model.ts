import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  deviceInfo?: string;
  ip?: string;
  expiresAt: Date;
  isValid: boolean;
}

const tokenSchema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },

    deviceInfo: String,
    ip: String,

    expiresAt: {
      type: Date,
      required: true,
    },

    isValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// optional cleanup index (auto-delete expired sessions)
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Token = mongoose.model<IToken>('Token', tokenSchema);