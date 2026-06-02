import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { AppError } from '../utils/appError';
import { asyncHandler } from '../utils/asyncHandler';
import { findUserById } from '../modules/auth/auth.repo';
import { logger } from '../config/logger.config';
import mongoose from 'mongoose';



interface JwtPayload {
  userId: string;
}

export const user = asyncHandler(
  async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith('Bearer ')
    ) {
      token = authHeader.split(' ')[1];
    }
  

    if (!token) {
      throw new AppError('Not authorized. No token provided.', 401);
    }

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
      ) as JwtPayload;
    } catch {
      throw new AppError('Invalid or expired token.', 401);
    }

    const user = await findUserById(decoded.userId);
    



    if (!user) {
      throw new AppError('User no longer exists.', 401);
    }

    req.user = {
      userId: user._id.toString(),
    };

    next();
  }
);
