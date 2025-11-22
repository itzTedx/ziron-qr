import { z } from "zod/v4";

export const loginUserSchema = z
  .object({
    email: z.email(),
    password: z.string().min(4),
  })
  .describe("Validates user login data: valid email, and password (min 4 chars).");

export type LoginUserType = z.infer<typeof loginUserSchema>;
