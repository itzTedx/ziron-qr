import "server-only";

import { createRouterClient } from "@orpc/server";

import { clientRouter } from "@ziron/api/routers/index";

globalThis.$client = createRouterClient(clientRouter, {
  /**
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
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
