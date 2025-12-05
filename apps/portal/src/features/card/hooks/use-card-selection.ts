import { useEffect } from "react";

import { useAtom } from "jotai";

import type { CardType } from "@ziron/db/schema";

import { isSelectModeAtom, lastSelectedCardIdAtom, selectedCardIdsAtom } from "@/features/card/cards-atoms";

export function useCardSelection(cards?: Partial<CardType>[]) {
  const [isSelectMode, setIsSelectMode] = useAtom(isSelectModeAtom);
  const [selectedCardIds, setSelectedCardIds] = useAtom(selectedCardIdsAtom);
  const [lastSelectedCardId, setLastSelectedCardId] = useAtom(lastSelectedCardIdAtom);

  // Deselect any cards no longer in the list
  useEffect(() => {
    if (cards) {
      setSelectedCardIds((prev) => prev.filter((id) => cards.some((card) => card.id === id)));
    }
  }, [cards, setSelectedCardIds]);

  const handleCardSelection = (cardId: string, e: React.MouseEvent) => {
    if (e.shiftKey && lastSelectedCardId && cards) {
      const lastSelectedIndex = cards.findIndex((card) => card.id === lastSelectedCardId);
      const currentIndex = cards.findIndex((card) => card.id === cardId);

      if (lastSelectedIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);
        const rangeIds: string[] = cards
          .slice(start, end + 1)
          .map((card) => card.id)
          .filter((id): id is string => id !== undefined);

        if (selectedCardIds.includes(cardId)) {
          setSelectedCardIds((prev) => prev.filter((id) => !rangeIds.includes(id)));
        } else {
          setSelectedCardIds((prev) => Array.from(new Set([...prev, ...rangeIds])) as string[]);
        }
        setLastSelectedCardId(cardId);
      }
    } else {
      setLastSelectedCardId(cardId);
      setSelectedCardIds((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]));
    }
  };

  const clearSelection = () => {
    setSelectedCardIds([]);
    setIsSelectMode(false);
    setLastSelectedCardId(null);
  };

  return {
    isSelectMode,
    setIsSelectMode,
    selectedCardIds,
    setSelectedCardIds,
    lastSelectedCardId,
    handleCardSelection,
    clearSelection,
  };
}
