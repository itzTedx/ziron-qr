import type { NextRequest } from "next/server";

import { ORPCError } from "@orpc/server";

import { auth } from "./auth";

export async function createContext(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "Unauthorized",
      status: 401,
    });
  }

  return {
    session: session.session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
