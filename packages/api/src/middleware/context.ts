import { NextRequest } from "next/server";

import { initAuth, type Session } from "@ziron/auth";
import { authEnv } from "@ziron/auth/env";

const baseUrl = authEnv().NODE_ENV === "production" ? "https://ziron-qr-portal.vercel.app" : "http://localhost:3000";

const auth = initAuth({
  baseUrl: baseUrl,
  secret: authEnv().BETTER_AUTH_SECRET,
});

export async function createContext(req?: NextRequest) {
  if (req?.headers) {
    const session = (await auth.api.getSession({
      headers: req.headers,
    })) as Session | null;

    return {
      session,
    };
  }

  return {
    session: null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
