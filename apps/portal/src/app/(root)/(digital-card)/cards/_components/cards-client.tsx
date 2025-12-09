"use client";

import { Suspense } from "react";

import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ziron/ui/components/input-group";
import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";
import { Skeleton } from "@ziron/ui/components/skeleton";

import { PageWidthWrapper } from "@/components/layout/page-width-wrapper";
import { AnimateIcon } from "@/components/ui/icon";

import { IconSlidersHorizontal } from "@/assets/icons";

import { selectedSortAtom, showArchivedAtom, viewModeAtom } from "@/features/card/cards-atoms";
import { useCardSelection } from "@/features/card/hooks/use-card-selection";
import { orpc } from "@/lib/orpc/client";

import { CardsDisplay } from "./cards-display";
import { CardsList } from "./cards-list";
import { CardsToolbar } from "./cards-toolbar";
import { MoreCardOptions } from "./more-card-options";

export const CardsClient = () => {
	const { data: preferences } = useSuspenseQuery(orpc.workspace.getPreferences.queryOptions());

	useHydrateAtoms([
		[viewModeAtom, preferences.viewMode],
		[showArchivedAtom, preferences.showArchived],
		[selectedSortAtom, preferences.sortBy],
	] as const);

	return (
		<ScrollArea className="h-full flex-1 overflow-y-auto">
			<div className="border-b py-2">
				<PageWidthWrapper className="flex flex-wrap items-center gap-2 sm:justify-between">
					<ButtonGroup className="w-full sm:w-fit">
						<AnimateIcon animateOnHover asChild>
							<Button
								className="w-full flex-1 justify-between bg-inherit sm:justify-start"
								variant="outline"
							>
								<span className="flex items-center gap-2">
									<IconSlidersHorizontal /> <span className="block">Filter</span>
								</span>
								<IconChevronDown className="size-4 text-muted-foreground" />
							</Button>
						</AnimateIcon>
					</ButtonGroup>

					<ButtonGroup className="w-full sm:w-fit">
						<ButtonGroup className="w-full sm:w-fit">
							<InputGroup className="w-full">
								<InputGroupInput placeholder="Search cards" />
								<InputGroupAddon>
									<IconSearch />
								</InputGroupAddon>
							</InputGroup>
						</ButtonGroup>
						<ButtonGroup>
							<CardsDisplay preferences={preferences} />
						</ButtonGroup>
						<ButtonGroup>
							<MoreCardOptions />
						</ButtonGroup>
					</ButtonGroup>
				</PageWidthWrapper>
			</div>

			<PageWidthWrapper className="py-2">
				<Suspense fallback={<CardsListSkeleton />}>
					<CardsClientContent />
				</Suspense>
			</PageWidthWrapper>

			<ScrollBar />
		</ScrollArea>
	);
};

function CardsListSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
			{Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map((id) => (
				<Skeleton className="h-64" key={id} />
			))}
		</div>
	);
}

export const CardsClientContent = () => {
	const showArchived = useAtomValue(showArchivedAtom);
	const viewMode = useAtomValue(viewModeAtom);
	const selectedSort = useAtomValue(selectedSortAtom);

	// Use useSuspenseQuery for cards list since it's prefetched
	const { data: cards } = useSuspenseQuery(
		orpc.card.list.queryOptions({
			input: { viewMode, sortBy: selectedSort, showArchived },
			context: { cache: true },
		})
	);

	// Use regular useQuery for count with optimized cache settings
	const { data: cardsCount } = useQuery({
		...orpc.card.count.queryOptions({
			input: { showArchived },
			context: { cache: true },
		}),
		staleTime: 5 * 60 * 1000, // 5 minutes - count doesn't change frequently
		gcTime: 10 * 60 * 1000, // 10 minutes cache time
	});

	const { isSelectMode, setIsSelectMode, selectedCardIds } = useCardSelection(cards);

	return (
		<>
			<CardsList
				cards={cards}
				isSelectMode={isSelectMode}
				loading={false}
				selectedCardIds={selectedCardIds}
				setIsSelectModeAction={setIsSelectMode}
				variant={viewMode}
			/>

			{cards && (
				<CardsToolbar
					cards={cards}
					cardsCount={cardsCount ?? 0}
					isSelectMode={isSelectMode}
					setIsSelectMode={setIsSelectMode}
				/>
			)}
		</>
	);
};
