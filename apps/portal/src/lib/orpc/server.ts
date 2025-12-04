import "server-only";

import { createRouterClient } from "@orpc/server";

import { router } from "@ziron/api/routers/index";

/**
 * Global client instance shared across all requests.
 *
 * Context is provided per-request using the request parameter passed to the context function.
 * The route handler in apps/portal/src/app/api/rpc/[[...rest]]/route.ts also provides
 * context at the handler level for HTTP requests.
 */
globalThis.$client = createRouterClient(router, {
  context: async ({ request }) => {
    try {
      // Dynamically import headers to avoid static analysis issues during build
      // Only call headers() if we're in a request context (not during static generation)
      const { headers } = await import("next/headers");
      return {
        request: request,
        reqHeaders: await headers(), // provide headers if initial context required
      };
    } catch {
      // During static generation, headers() may not be available
      // Return context without headers in that case
      return {
        request: request,
        reqHeaders: new Headers(),
      };
    }
  },
});
