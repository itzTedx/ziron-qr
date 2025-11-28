import "server-only";

import { initAuth } from "@ziron/auth";

import { env } from "@/lib/env/server";

// const baseUrl = env.NODE_ENV === "production" ? env.PRODUCTION_URL : "http://localhost:3000";
const baseUrl = "https://ziron-qr-portal.vercel.app";

export const auth = initAuth({
  baseUrl,
  secret: env.BETTER_AUTH_SECRET,
});
