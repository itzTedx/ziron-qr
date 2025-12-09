import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ClientRouterClient } from "@ziron/api/routers/index";

declare global {
	var $client: ClientRouterClient | undefined;
}

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
	// headers: async () => {
	//   if (typeof window !== "undefined") {
	//     return {};
	//   }

	//   const { headers } = await import("next/headers");
	//   return await headers();
	// },
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: ClientRouterClient = globalThis.$client ?? createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
