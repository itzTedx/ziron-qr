import { NextRequest } from "next/server";

import { initAuth, type Session } from "@ziron/auth";
import { authEnv } from "@ziron/auth/env";

const baseUrl = authEnv().NODE_ENV === "production" ? "https://ziron-qr-portal.vercel.app" : "http://localhost:3000";

const auth = initAuth({
  baseUrl: baseUrl,
  secret: authEnv().BETTER_AUTH_SECRET,
});

export async function createContext(req?: NextRequest) {
  if (!req?.headers) {
    return {
      session: null,
    };
  }

  try {
    // Better Auth's getSession expects headers with cookies properly accessible
    // NextRequest.headers is already a Headers object, but we need to ensure
    // cookies are properly forwarded. The headers object should work as-is.
    const session = (await auth.api.getSession({
      headers: req.headers,
    })) as Session | null;

    return {
      session,
    };
  } catch (error) {
    // Gracefully handle errors during session retrieval
    // This can happen on first request after refresh due to timing issues
    // or when cookies are not yet available
    console.error("Error retrieving session:", error);
    return {
      session: null,
    };
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>;
