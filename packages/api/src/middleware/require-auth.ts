import { base } from "./base";

// const DEBUG = process.env.NODE_ENV === "development" || process.env.DEBUG_AUTH === "true";

export const requireAuth = base.middleware(async ({ context, next, errors }) => {
  if (!context.session) {
    throw errors.UNAUTHORIZED({
      message: "You must be authenticated to access this endpoint.",
    });
  }

  return next({
    context: {
      session: context.session,
    },
  });
});
