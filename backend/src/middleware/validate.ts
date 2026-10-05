import type { NextFunction, Request, RequestHandler, Response } from "express";

import type { ZodSchema } from "zod";

export const validate = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });

        return;
      }

      req.body = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};
