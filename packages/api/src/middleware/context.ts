import { NextRequest } from "next/server";

import { type Auth, initAuth } from "@ziron/auth";
import { authEnv } from "@ziron/auth/env";

const baseUrl = authEnv().NODE_ENV === "production" ? "https://ziron-qr-portal.vercel.app" : "http://localhost:3000";

export const auth: Auth = initAuth({
  baseUrl: baseUrl,
  secret: authEnv().BETTER_AUTH_SECRET,
});

export async function createContext(request: NextRequest, headers?: Headers) {
  if (headers) {
    const session = await auth.api.getSession({
      headers,
    });

    return {
      session,
      headers,
      request,
    };
  }

  return {
    session: null,
    headers,
    request,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
