import { redirect } from "next/navigation";

import { base } from "./base";

export const requireAuth = base.middleware(async ({ context, next }) => {
  const session = context.session;

  if (!session?.session || !session?.user) {
    redirect("/login");
  }

  return next({
    context: { user: session.user },
  });
});
