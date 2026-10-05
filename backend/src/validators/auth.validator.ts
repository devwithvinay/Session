import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters"),

  email: z.string().trim().toLowerCase().email("Please provide a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
});

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password is too long"),

    confirmPassword: z
      .string()
      .min(6, "Please provide at least 6 characters")
      .max(128, "Password is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
