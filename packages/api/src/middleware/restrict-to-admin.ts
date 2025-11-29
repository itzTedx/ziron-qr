import { base } from "./base";

export const restrictToAdmin = base.middleware(async ({ context, next, errors }) => {
  const role = context.session?.user?.role;

  const isAdmin = role === "admin" || role === "dev";

  if (!isAdmin) {
    throw errors.FORBIDDEN();
  }

  return next({ context: { isAdmin, session: context.session } });
});
