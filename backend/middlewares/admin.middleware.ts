import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../configs/env";
import { AppError } from "@/utils/appError";
import { asyncHandler } from "@/utils/asyncHandler";

import { findAdminById } from "@/modules/admin/auth/auth.repo";

interface AdminJwtPayload {
  adminId: string;
  role: "admin" | "super-admin";
}

export const admin = asyncHandler(
  async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    let token: string | undefined;

    const authHeader =
      req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token =
        authHeader.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "Not authorized. No token provided.",
        401
      );
    }

    let decoded: AdminJwtPayload;

    try {
      decoded = jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
      ) as AdminJwtPayload;
    } catch {
      throw new AppError(
        "Invalid or expired token.",
        401
      );
    }

    const admin =
      await findAdminById(
        decoded.adminId
      );

    if (!admin) {
      throw new AppError(
        "Admin no longer exists.",
        401
      );
    }

    req.admin = {
      adminId:
        admin._id.toString(),
      role: admin.role,
    };

    next();
  }
);