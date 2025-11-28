import type { NextRequest } from "next/server";

import { initAuth } from "@ziron/auth";
import { authEnv } from "@ziron/auth/env";

const auth = initAuth({
  baseUrl: authEnv().BETTER_AUTH_URL,
  secret: authEnv().BETTER_AUTH_SECRET,
});

export async function createContext(req: NextRequest | Request | Headers | undefined) {
  // Handle undefined or null request
  if (!req) {
    return {
      session: null,
      request: undefined,
    };
  }

  // Handle Headers object (from global client when only headers available)
  if (req instanceof Headers) {
    const session = await auth.api.getSession({
      headers: req,
    });
    return {
      session,
      request: undefined, // Headers-only, no full request available
    };
  }

  // Handle NextRequest or Request object (from route handler or ORPC)
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return {
    session,
    request: req, // Store the request for router access (Request or NextRequest)
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
