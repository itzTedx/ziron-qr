import { Suspense } from "react";

import { Route } from "next";

import Header from "@/components/layout/header";
import { CreateButton } from "@/components/ui/create-button";

import { OrganizationClient } from "@/features/organization/components/organization-client";
import { orpc } from "@/lib/orpc/client";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

export default async function OrganizationsPage() {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(orpc.organization.list.queryOptions());
	return (
		<>
			<Header title="Organizations">
				<CreateButton
					hotkey="d"
					href={"/organization/?modal=organization" as Route}
					label="Create Organization"
				/>
			</Header>
			<Suspense>
				<HydrateClient client={queryClient}>
					<OrganizationClient />
				</HydrateClient>
			</Suspense>
		</>
	);
}
