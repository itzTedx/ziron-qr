import "server-only";

import { createRouterClient } from "@orpc/server";

import { createContext } from "@ziron/api/middleware/context";
import { router } from "@ziron/api/routers/index";

/**
 * Global client instance shared across all requests.
 *
 * Context is provided per-request using the request parameter passed to the context function.
 * The route handler in apps/portal/src/app/api/rpc/[[...rest]]/route.ts also provides
 * context at the handler level for HTTP requests.
 */
globalThis.$client = createRouterClient(router, {
  context: async ({ request }) => await createContext(request),
});
