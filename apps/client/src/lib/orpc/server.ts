import "server-only";

import { headers } from "next/headers";

import { createRouterClient } from "@orpc/server";

import { createContext } from "@ziron/api/middleware/context";
import { clientRouter } from "@ziron/api/routers/index";

globalThis.$client = createRouterClient(clientRouter, {
  /**
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
  context: async ({ request }) => await createContext(request, await headers()),
});
