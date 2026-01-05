import { Suspense } from "react";

import Header from "@/components/layout/header";
import { CreateButton } from "@/components/ui/create-button";

import { orpc } from "@/lib/orpc/client";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

import { CardsClient } from "./_components/cards-client";

export default async function CardsPage() {
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
		<>
			<Header title="Cards">
				<CreateButton hotkey="c" href={"/cards/create"} label="Create Card" />
			</Header>

			<Suspense fallback={<CardsPageSkeleton />}>
				<HydrateClient client={queryClient}>
					<CardsClient />
				</HydrateClient>
			</Suspense>
		</>
	);
}

function CardsPageSkeleton() {
	return (
		<div className="h-full flex-1 animate-pulse pt-3 sm:py-4">
			<div className="flex flex-wrap items-center gap-2 px-4 sm:justify-between sm:px-6">
				<div className="h-10 w-32 rounded-md bg-muted" />
				<div className="h-10 w-64 rounded-md bg-muted" />
			</div>
			<div className="mt-3 grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-5">
				{Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map((id) => (
					<div className="h-64 rounded-lg bg-muted" key={id} />
				))}
			</div>
		</div>
	);
}
