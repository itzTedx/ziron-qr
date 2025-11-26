import { createEnv } from "@t3-oss/env-nextjs";

import { z } from "@ziron/validators";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BASE_URL: z.url(),
    NEXT_PUBLIC_CLIENT_URL: z.url(),
  },

  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
  },
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
