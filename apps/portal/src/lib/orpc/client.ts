import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { DedupeRequestsPlugin } from "@orpc/client/plugins";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import { router } from "@ziron/api/routers/index";

const link = new RPCLink({
	url: `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/api/rpc`,
	headers: async () => {
		if (typeof window !== "undefined") {
			return {};
		}

		const { headers } = await import("next/headers");
		return await headers();
	},

	plugins: [
		new DedupeRequestsPlugin({
			filter: ({ request }) => request.method === "GET", // Filters requests to dedupe
			groups: [
				{
					condition: ({ context }) => context?.cache === "force-cache",
					context: {
						cache: "force-cache",
					},
				},
				{
					condition: () => true,
					context: {}, // Context used for the rest of the request lifecycle
				},
			],
		}),
	],
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> = globalThis.$client ?? createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
