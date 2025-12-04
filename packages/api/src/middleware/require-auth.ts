import { headers } from "next/headers";

import { base } from "./base";
import { auth } from "./context";

// const DEBUG = process.env.NODE_ENV === "development" || process.env.DEBUG_AUTH === "true";

export const requireAuth = base.middleware(async ({ next, errors }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) {
    throw errors.UNAUTHORIZED({ message: "You are not authorized to access this endpoint." });
  }

  return next({
    context: {
      session: session,
    },
  });
});
