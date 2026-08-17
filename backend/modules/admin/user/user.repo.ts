import { User, IUser } from "@/models/user.model";

export const findUsers = async (params: {
  page: number;
  limit: number;
  search?: string;
  isDeleted?: boolean;
}) => {
  const { page, limit, search, isDeleted } = params;

  const skip = (page - 1) * limit;

  const filter: any = {};

  // Only filter if explicitly provided
  if (isDeleted !== undefined) {
    filter.isDeleted = isDeleted;
  }

  if (search) {
    filter.email = { $regex: search, $options: "i" };
  }

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const findUserById = (id: string) => {
  return User.findOne({ _id: id, isDeleted: false });
};

export const softDeleteUserById = (id: string) => {
  return User.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    {
      new: true,
    }
  );
};