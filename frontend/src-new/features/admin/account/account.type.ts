
export type AdminRole = "super-admin" | "admin";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeAdminNamePayload {
  name: string;
}

export interface ChangeAdminNameAdmin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface ChangeAdminNameData {
  admin: ChangeAdminNameAdmin;
}