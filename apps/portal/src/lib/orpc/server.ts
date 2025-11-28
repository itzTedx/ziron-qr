import "server-only";

import { cache } from "react";

import { headers } from "next/headers";

import { createRouterClient } from "@orpc/server";

import { router } from "@ziron/api/routers/index";

const getCachedHeaders = cache(async () => {
  return await headers();
});

globalThis.$client = createRouterClient(router, {
  /**
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
  context: async () => ({
    headers: await getCachedHeaders(),
    request: new Request("http://localhost:3000/api/rpc"),
  }),
});
