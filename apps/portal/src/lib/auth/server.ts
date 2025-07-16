import "server-only";

import { env } from "@/lib/env/server";

import { initAuth } from "@ziron/auth";

const baseUrl =
  env.NODE_ENV === "production"
    ? `https://${env.PRODUCTION_URL}`
    : "http://localhost:3000";

export const auth = initAuth({
  baseUrl,
  productionUrl: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
});
