"use client";

import { cva } from "@ziron/ui/components/index.ts";
import { Skeleton } from "@ziron/ui/components/skeleton";

import { CardTypeWithPageVisits } from "@ziron/db/schema";
import { cn } from "@ziron/utils";

import { AnimatedEmptyState } from "@/components/shared/animated-empty";
import { CreateButton } from "@/components/ui/create-button";

import { CursorRays, Hyperlink } from "@/assets/icons";

import { PersonCard } from "@/features/card/components/person-card";
import { useCardSelection } from "@/features/card/hooks/use-card-selection";

const cardListVariants = cva("group/card-list grid w-full min-w-0 transition-[gap,opacity]", {
  variants: {
    variant: {
      cards: "grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
      rows: "gap-0",
    },
    loading: {
      true: "opacity-50",
    },
  },
});

export const CardsList = ({
  cards,
  loading,
  isSelectMode,
  setIsSelectModeAction,
  selectedCardIds,
  variant = "cards",
}: {
  cards?: CardTypeWithPageVisits[];
  loading: boolean;
  isSelectMode: boolean;
  setIsSelectModeAction: (isSelectMode: boolean) => void;
  selectedCardIds: string[];
  variant?: "cards" | "rows";
}) => {
  const { handleCardSelection } = useCardSelection(cards);
  const isFiltered = false;

  if (loading) {
    return (
      <div className={cn(cardListVariants({ variant, loading }))}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (cards && cards.length === 0) {
    return (
      <AnimatedEmptyState
        cardContent={
          <>
            <Hyperlink className="size-4 text-foreground" />
            <div className="h-2.5 w-24 min-w-0 rounded-sm bg-background" />
            <div className="xs:flex hidden grow items-center justify-end gap-1.5 text-muted-foreground">
              <CursorRays className="size-3.5" />
            </div>
          </>
        }
        description={
          isFiltered
            ? "Bummer! There are no cards that match your filters. Adjust your filters to yield more results."
            : "Start creating cards for your marketing campaigns, referral programs, and more."
        }
        title={isFiltered ? "No cards found" : "No cards yet"}
        {...(!isFiltered && {
          addButton: (
            <div>
              <CreateButton hotkey="c" href={"/cards/create"} label="Create Card" />
            </div>
          ),
        })}
      />
    );
  }

  return (
    <div className={cn(cardListVariants({ variant, loading }))} data-variant={variant}>
      {cards &&
        cards.map((card) => (
          <PersonCard
            card={card}
            handleCardSelection={handleCardSelection}
            isSelectMode={isSelectMode}
            key={card.id}
            selectedCardIds={selectedCardIds}
            setIsSelectMode={setIsSelectModeAction}
            variant={variant}
          />
        ))}
    </div>
  );
};
