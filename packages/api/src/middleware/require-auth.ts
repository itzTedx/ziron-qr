import { base } from "./base";

export const requireAuth = base.middleware(async ({ context, next, errors }) => {
  const session = context.session;

  // console.log("session", session);

  if (!session?.session || !session?.user) {
    throw errors.UNAUTHORIZED();
  }

  return next({
    context: { user: session.user },
  });
});
