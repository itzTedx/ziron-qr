import { base } from "./base";

export const requireAuth = base.middleware(async ({ context, next, errors }) => {
  console.log("context", context.session);

  if (!context.session) {
    throw errors.UNAUTHORIZED();
  }
  return next({
    context: {
      session: context.session,
    },
  });
});
