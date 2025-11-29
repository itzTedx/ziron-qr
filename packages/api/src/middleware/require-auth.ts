import { ORPCError } from "@orpc/server";

import { base } from "./base";

export const requireAuth = base.middleware(async ({ context, next }) => {
  console.log("context", context);

  if (!context.session) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});
