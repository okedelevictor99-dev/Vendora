import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/appError";

export const superAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const admin = req.admin;

  if (!admin) {
    return next(
      new AppError(
        "Unauthorized",
        401
      )
    );
  }

  if (
    admin.role !== "super-admin"
  ) {
    return next(
      new AppError(
        "Forbidden: Superadmin only route",
        403
      )
    );
  }

  next();
};