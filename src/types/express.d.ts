import { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      // 🔐 Auth user (from JWT middleware)
      
      user?: {
        userId: string;
      };
      admin?: {
        adminId: string;
        role: "admin" | "super-admin";
      };

      // 🛡️ Validated request data (from Zod middleware)
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
    }
  }
}

export {};