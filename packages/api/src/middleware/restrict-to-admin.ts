import type { User } from "@ziron/auth";

import { base } from "./base";

export const restrictToAdmin = base.$context<{ user: User }>().middleware(async ({ context, next, errors }) => {
  const { role } = context.user;

  const isAdmin = role === "admin" || role === "dev";

  if (!isAdmin) {
    throw errors.FORBIDDEN();
  }

  return next({ context: { isAdmin, user: context.user } });
});
