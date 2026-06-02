import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

type RequestSchema = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export const validate =
  (schema: RequestSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      // 🧼 validate each part separately (NO req mutation)
      if (schema.body) {
        req.validatedBody = schema.body.parse(req.body);
      }

      if (schema.query) {
        req.validatedQuery = schema.query.parse(req.query);
      }

      if (schema.params) {
        req.validatedParams = schema.params.parse(req.params);
      }

      next();
    } catch (error) {
      next(error);
    }
  };