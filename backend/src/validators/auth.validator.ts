import { z} from 'zod';

export const registerSchema = z.object({
    username: z
    .string()
    .trim()
    .min(3,"Username must be atleast 3 character"),

    email:z
    .string()
    .trim()
    .email("please provide valid email"),

    password: z
    .string()
    .min(6 , "password atleast 6 characters"),
})

export const loginSchema = z.object({
    email: z
    .string()
    .trim()
    .email("please provide a valid email"),

    password: z
    .string()
    .min(1, "password is required")
}) 

export const forgotPasswordSchema = z.object({
  email: z
  .string().
  trim()
  .email("Please provide a valid email"),
});

export const resetPasswordSchema = z.object({
    password: z
    .string()
    .min(6, "Please provide atleast 6 characters")
})
