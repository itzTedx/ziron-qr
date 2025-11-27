import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),

    UNSPLASH_ACCESS_KEY: z.string().min(1),

    NODE_ENV: z.enum(["development", "production"]).optional(),
    PRODUCTION_URL: z.url(),
  },

  experimental__runtimeEnv: {},
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
