import "server-only";

import { nextCookies } from "better-auth/next-js";
import { openAPI } from "better-auth/plugins";

import { initAuth } from "@ziron/auth";

import { env } from "@/lib/env/server";

const baseUrl = env.NODE_ENV === "production" ? "https://ziron-qr-portal.vercel.app" : "http://localhost:3000";
// const baseUrl = "https://ziron-qr-portal.vercel.app";

console.log("baseUrl:", baseUrl);

export const auth = initAuth({
  baseUrl,
  secret: env.BETTER_AUTH_SECRET,
  plugins: [openAPI(), nextCookies()],
});
