export interface User {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  pendingEmail?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  isDeleted?: boolean;
}

export interface UserListData {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}