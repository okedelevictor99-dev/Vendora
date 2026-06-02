import { User, IUser } from '../../models/user.model';
import { Token } from '../../models/user.token.model';
import mongoose from 'mongoose';

// ----------------------
// USER QUERIES
// ----------------------

export const createUser = async (
  data: Partial<IUser>
): Promise<IUser> => {
  return User.create(data);
};

export const findUserByEmail = async (
  email: string,
  includePassword = false
): Promise<IUser | null> => {
  const query = User.findOne({ email });

  if (includePassword) {
    query.select('+password');
  }

  return query;
};
export const findUserByPendingEmail = async (
  email: string,
  includePassword = false
): Promise<IUser | null> => {
  const query = User.findOne({ pendingEmail:email });

  if (includePassword) {
    query.select('+password');
  }

  return query;
};

export const findUserById = async (
  id: string,
  includePassword: boolean = false
): Promise<IUser | null> => {
  if (includePassword) {
    return User.findById(id).select("+password");
  }

  return User.findById(id);
};

export const findUserByVerificationToken = async (
  email: string,
  token: string
): Promise<IUser | null> => {
  return User.findOne({
    email,
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  });
};

export const updateUserById = async (
  id: string,
  update: Partial<IUser>
): Promise<IUser | null> => {
  return User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
};

export const saveUser = async (user: IUser): Promise<IUser> => {
  return user.save();
};

// ----------------------
// TOKEN QUERIES
// ----------------------

export const saveRefreshToken = async (data: {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  deviceInfo?: string;
  ip?: string;
  expiresAt: Date;
}) => {
  return Token.create(data);
};

export const findToken = async (refreshToken: string) => {
  return Token.findOne({
    refreshToken,
    isValid: true,
    expiresAt: { $gt: new Date() },
  });
};

export const revokeToken = async (refreshToken: string) => {
  return Token.findOneAndUpdate(
    { refreshToken, isValid: true },
    { isValid: false },
    { new: true }
  );
};

export const revokeAllUserTokens = async (userId: string) => {
  return Token.updateMany(
    { userId, isValid: true },
    { isValid: false }
  );
};

export const deleteExpiredTokens = async () => {
  return Token.deleteMany({
    expiresAt: { $lt: new Date() },
  });
};