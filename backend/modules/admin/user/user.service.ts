import { AppError } from "@/utils/appError";
import { findUsers, findUserById, softDeleteUserById } from "./user.repo";
import { revokeAllUserTokens } from "@/modules/client/auth/auth.repo";

export const getAdminUsersService = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search;

  let isDeleted;

  if (query.isDeleted !== undefined) {
    isDeleted = query.isDeleted === "true";
  }

  return await findUsers({
    page,
    limit,
    search,
    isDeleted,
  });
};

export const getAdminUserByIdService = async (id: string) => {
  const user = await findUserById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const deleteUserService = async (id: string) => {
  const existingUser = await findUserById(id);

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  const deletedUser = await softDeleteUserById(id);
  await revokeAllUserTokens(id);

  return deletedUser;
};