import { Request, Response, NextFunction } from 'express';
import { AppError } from "@/utils/appError";
import { env } from '../configs/env';

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof AppError)) {
  console.error("UNEXPECTED ERROR:", err);
  error = new AppError("Internal Server Error", 500);
}
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};