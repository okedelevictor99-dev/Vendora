import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../configs/env';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;

  emailVerificationToken?: string|null;
  emailVerificationExpires?: Date|null;

  passwordResetToken?: string|null;
  passwordResetExpires?: Date|null;
  pendingEmail?: string | null;
  emailChangeToken?: string | null;
  emailChangeExpires?: Date | null;
  createdAt:Date,
  updatedAt:Date

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },
    pendingEmail: {
     type: String,
     default: null,
},

   emailChangeToken: {
    type: String,
    default: null,
},

   emailChangeExpires: {
    type: Date,
    default: null,
},
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUNDS));
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);