import {
  findAdminById,
  saveAdmin,
} from "@/modules/admin/auth/auth.repo";
import { AppError } from "@/utils/appError";

export const changeAdminNameService = async (
  adminId: string,
  name: string
) => {
  const admin = await findAdminById(adminId);
  if (!admin) throw new AppError("Admin not found", 404);

  admin.name = name;
  await saveAdmin(admin);

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
};


export const getAdminProfileService = async (adminId: string) => {
  const admin = await findAdminById(adminId);
  if (!admin) throw new AppError("Admin not found", 404);

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
};