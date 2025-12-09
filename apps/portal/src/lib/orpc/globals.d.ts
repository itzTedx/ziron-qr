import type { RouterClient } from "@orpc/server";

import { router } from "@ziron/api/routers/index";

declare global {
	// Shared singleton client populated in server runtime
	var $client: RouterClient<typeof router> | undefined;
}

export {};
