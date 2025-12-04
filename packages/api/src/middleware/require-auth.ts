import { base } from "./base";
import { auth } from "./context";

// const DEBUG = process.env.NODE_ENV === "development" || process.env.DEBUG_AUTH === "true";

export const requireAuth = base.middleware(async ({ context, next, errors }) => {
  if (!context.reqHeaders) {
    throw errors.UNAUTHORIZED({ message: "You are not authorized to access this endpoint." });
  }

  const session = await auth.api.getSession({
    headers: context.reqHeaders,
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
