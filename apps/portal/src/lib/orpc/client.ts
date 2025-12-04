import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { DedupeRequestsPlugin } from "@orpc/client/plugins";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { router } from "@ziron/api/routers/index";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: "retry",
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

const link = new RPCLink({
  url: `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/api/rpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
  // headers: async () => {
  //   if (typeof window !== "undefined") {
  //     return {};
  //   }

  //   const { headers } = await import("next/headers");
  //   return await headers();
  // },
  plugins: [
    new DedupeRequestsPlugin({
      filter: ({ request }) => request.method === "POST", // Filters requests to dedupe
      groups: [
        {
          condition: () => true,
          context: {}, // Context used for the rest of the request lifecycle
        },
      ],
    }),
  ],
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> = globalThis.$client ?? createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
