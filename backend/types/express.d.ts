import { IUser } from "@/models/user.model";

declare global {
  namespace Express {
    interface Request {
      
      user?: {
        userId: string;
      };
      admin?: {
        adminId: string;
        role: "admin" | "super-admin";
      };
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
      rawBody?:any
    }
  }
}

export {};