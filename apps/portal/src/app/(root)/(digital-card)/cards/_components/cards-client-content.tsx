"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { selectedSortAtom, showArchivedAtom, viewModeAtom } from "@/features/card/cards-atoms";
import { useCardSelection } from "@/features/card/hooks/use-card-selection";
import { orpc } from "@/lib/orpc/client";

import { CardsList } from "./cards-list";
import { CardsToolbar } from "./cards-toolbar";

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
