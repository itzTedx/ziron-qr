"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { IconMouse } from "@ziron/ui/assets/icons/mouse";
import { Button } from "@ziron/ui/components/button";

import { pluralize } from "@ziron/utils";

import { orpc } from "@/lib/orpc/client";

interface ClicksVisitsProps {
	cardId: string;
	className?: string;
}

export const ClicksVisits = ({ cardId, className }: ClicksVisitsProps) => {
	const { data: analytics } = useSuspenseQuery(
		orpc.analytics.getCardAnalytics.queryOptions({
			input: {
				cardId,
			},
		})
	);

	return (
		<Button className={className} size="sm" type="button" variant="outline">
			<IconMouse className="text-primary" />
			{analytics.totalVisits} {pluralize("click", analytics.totalVisits)}
		</Button>
	);
};
