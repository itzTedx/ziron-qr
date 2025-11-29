import "server-only";

import { openAPI } from "better-auth/plugins";

import { initAuth } from "@ziron/auth";

import { env } from "@/lib/env/server";

const baseUrl = env.NODE_ENV === "production" ? "https://ziron-qr-portal.vercel.app" : "http://localhost:3000";

export const auth = initAuth({
  baseUrl: baseUrl,
  trustedOrigins: [baseUrl],
  plugins: [openAPI()],
  secret: env.BETTER_AUTH_SECRET,
});
