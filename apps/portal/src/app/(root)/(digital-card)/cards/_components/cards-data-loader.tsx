import { orpc } from "@/lib/orpc/client";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

import { CardsClient } from "./cards-client";

export async function CardsDataLoader() {
	const queryClient = getQueryClient();

	// Prefetch both queries in parallel for better performance
	// Prefetch cards with default values (most common case)
	// If user has different preferences, React Query will handle the refetch
	// Fetch preferences first to ensure we prefetch the correct cards list
	const preferences = await queryClient.fetchQuery(orpc.workspace.getPreferences.queryOptions());

	await Promise.all([
		queryClient.prefetchQuery(
			orpc.card.list.queryOptions({
				input: {
					viewMode: preferences.viewMode,
					sortBy: preferences.sortBy,
					showArchived: preferences.showArchived,
				},
				context: { cache: true },
			})
		),
		queryClient.prefetchQuery(
			orpc.card.count.queryOptions({
				input: { showArchived: preferences.showArchived },
				context: { cache: true },
			})
		),
	]);

	return (
		<HydrateClient client={queryClient}>
			<CardsClient />
		</HydrateClient>
	);
}
