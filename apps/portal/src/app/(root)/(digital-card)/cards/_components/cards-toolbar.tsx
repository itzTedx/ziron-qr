import { memo } from "react";

import { AnimatedSizeContainer } from "@ziron/ui/components/animated-size-container";

import { CardType } from "@ziron/db/schema";
import { cn } from "@ziron/utils";

interface Props {
  isLoading: boolean;
  cards: CardType[];
  cardsCount: number;
}

export const CardsToolbar = memo(({ isLoading, cards, cardsCount }: Props) => {
  return (
    <>
      <div className="h-[90px]" />

      <div className="fixed bottom-4 left-0 z-10 w-full [--left:62px] sm:max-[1372px]:w-[calc(100%-150px)] md:left-(--left) md:w-[calc(100%-var(--left))] md:max-[1372px]:w-[calc(100%-var(--left)-150px)]">
        <div
          className={cn(
            "-translate-x-1/2 relative left-1/2 w-full max-w-[768px] px-5",
            "max-[1372px]:left-0 max-[1372px]:translate-x-0"
          )}
        >
          <div className="filter-[drop-shadow(0_5px_8px_#222A351d)] overflow-hidden rounded-xl border bg-card">
            <AnimatedSizeContainer height>Toolbar</AnimatedSizeContainer>
          </div>
        </div>
      </div>
    </>
  );
});
