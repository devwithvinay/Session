import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";

interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const loggedIn = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.token;

    // No token
    if (!token) {
      throw new AppError("Authentication required. Please login.", 401);
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    // Server configuration error
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables");

      throw new AppError("Authentication service is not configured.", 500);
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validate payload
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "string" ||
      typeof decoded.email !== "string"
    ) {
      throw new AppError("Invalid authentication token.", 401);
    }

    const user = decoded as JwtPayload;

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
