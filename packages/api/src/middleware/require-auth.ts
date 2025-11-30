import { base } from "./base";

const DEBUG = process.env.NODE_ENV === "development" || process.env.DEBUG_AUTH === "true";

export const requireAuth = base.middleware(async ({ context, next, errors }) => {
  // Debug logging (only in development or when DEBUG_AUTH is enabled)
  if (DEBUG) {
    const requestUrl = context.request.url;
    const requestMethod = context.request.method;
    const hasSession = !!context.session;
    // Better Auth session structure: session.session.id for session ID
    const sessionId = context.session?.session?.id;
    const userId = context.session?.user?.id;
    const userEmail = context.session?.user?.email;

    console.log("[requireAuth] Authentication check:", {
      url: requestUrl,
      method: requestMethod,
      hasSession,
      sessionId,
      userId,
      userEmail,
      timestamp: new Date().toISOString(),
    });

    // Log request headers for debugging (sanitized)
    const headers = context.request.headers;
    const authHeader = headers.get("authorization");
    const cookieHeader = headers.get("cookie");
    console.log("[requireAuth] Request headers:", {
      hasAuthHeader: !!authHeader,
      authHeaderPrefix: authHeader ? `${authHeader.substring(0, 20)}...` : undefined,
      hasCookieHeader: !!cookieHeader,
      cookieCount: cookieHeader?.split(";").length || 0,
    });
  }

  if (!context.session) {
    // Enhanced error with debugging context
    const errorContext = DEBUG
      ? {
          message: "Authentication required but no session found",
          url: context.request.url,
          method: context.request.method,
          hasHeaders: !!context.request.headers,
        }
      : undefined;

    if (DEBUG) {
      console.error("[requireAuth] UNAUTHORIZED - No session found:", errorContext);
    }

    throw errors.UNAUTHORIZED({
      message: "You must be authenticated to access this endpoint.",
      cause: errorContext,
    });
  }

  // Log successful authentication in debug mode
  if (DEBUG) {
    const session = context.session;
    console.log("[requireAuth] Authentication successful:", {
      userId: session.user.id,
      userEmail: session.user.email,
      sessionId: "session" in session && session.session ? session.session.id : undefined,
    });
  }

  return next({
    context: {
      session: context.session,
    },
  });
});
