import { initAuth } from "@ziron/auth";
import { authEnv } from "@ziron/auth/env";

import { base } from "./base";

export const requireAuth = base.middleware(async ({ context, next, errors }) => {
  const session = await getSession(context.request);

  if (!session?.session) {
    throw errors.UNAUTHORIZED();
  }

  return next({
    context: { user: session.session },
  });
});

export const auth = initAuth({
  baseUrl: authEnv().BETTER_AUTH_URL,
  productionUrl: authEnv().PRODUCTION_URL,
  secret: authEnv().BETTER_AUTH_SECRET,
});

async function getSession(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session;
}
