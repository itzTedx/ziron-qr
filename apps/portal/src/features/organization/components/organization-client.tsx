"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import { PageWidthWrapper } from "@/components/layout/page-width-wrapper";

import { orpc } from "@/lib/orpc/client";

import { EmptyOrganization } from "./empty-organization";
import { OrganizationsList } from "./organizations-list";

export const OrganizationClient = () => {
	const { data: organizations } = useSuspenseQuery(orpc.organization.list.queryOptions());

	if (!organizations?.length) {
		return (
			<section className="px-6 pt-12">
				<EmptyOrganization />
			</section>
		);
	}

	return (
		<ScrollArea className="h-full flex-1 overflow-y-auto pt-3 sm:py-4">
			<PageWidthWrapper>
				<OrganizationsList organizations={organizations} />
			</PageWidthWrapper>
			<ScrollBar />
		</ScrollArea>
	);
};
