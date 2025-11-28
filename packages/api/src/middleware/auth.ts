import { redirect } from "next/navigation";

import { initAuth } from "@ziron/auth";
import { authEnv } from "@ziron/auth/env";

import { base } from "./base";

export const requireAuth = base.middleware(async ({ context, next }) => {
  const session = await getSession(context.headers);

  if (!session?.session) {
    redirect("/unauthorized");
    // throw errors.UNAUTHORIZED();
  }

  return next({
    context: { user: session.session },
  });
});

export const auth = initAuth({
  baseUrl: authEnv().BETTER_AUTH_URL,
  secret: authEnv().BETTER_AUTH_SECRET,
});

async function getSession(request: Headers) {
  const session = await auth.api.getSession({
    headers: request,
  });

  return session;
}
