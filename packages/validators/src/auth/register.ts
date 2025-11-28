import { z } from "zod/v4";

// Schema for validating user registration data:
// - username: string (2-50 characters)
// - email: valid email address
// - password: string (min 4 characters)
export const registerUserSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters long" })
      .max(50, { message: "Username must be less than 50 characters long" }),
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
  })
  .describe("Validates user registration data: username (2-50 chars), valid email, and password (min 4 chars).");

export type RegisterUserType = z.infer<typeof registerUserSchema>;
