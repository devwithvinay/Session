import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

interface AppError extends Error {
  statusCode?: number;
  status?: number;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("❌ ERROR:", {
    message: error.message,
    method: req.method,
    url: req.originalUrl,
    stack: error.stack,
  });

  // ---------------- ZOD VALIDATION ERROR ----------------

  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: errors[0]?.message || "Validation failed",
      errors,
    });
  }

  // ---------------- MONGOOSE VALIDATION ERROR ----------------

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: errors[0]?.message || "Validation failed",
      errors,
    });
  }

  // ---------------- MONGOOSE INVALID ID ----------------

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${error.path}`,
    });
  }

  // ---------------- DUPLICATE MONGODB DATA ----------------

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    return res.status(409).json({
      success: false,
      message: "This data already exists",
    });
  }

  // ---------------- JWT ERRORS ----------------

  if (error instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Your session has expired. Please login again.",
    });
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }

  // ---------------- NORMAL APP ERROR ----------------

  const statusCode = error.statusCode ?? error.status ?? 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? "Internal server error. Please try again later."
        : error.message || "Something went wrong.",
  });
};
