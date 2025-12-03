"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { cn } from "@ziron/utils";

import { AnimatedEmptyState } from "@/components/shared/animated-empty";
import { CreateButton } from "@/components/ui/create-button";

import { CursorRays, Hyperlink } from "@/assets/icons";

import { PersonCard } from "@/features/card/components/person-card";
import { orpc } from "@/lib/orpc/client";

export const CardsItems = ({
  isSelectMode,
  setIsSelectMode,
  variant = "cards",
}: {
  isSelectMode: boolean;
  setIsSelectMode: (isSelectMode: boolean) => void;
  variant?: "cards" | "rows";
}) => {
  const { data: cards, isError } = useSuspenseQuery(orpc.card.list.queryOptions());

  if (isError) {
    return <div>Error loading cards</div>;
  }

  const isFiltered = false;

  if (cards.length === 0) {
    return (
      <AnimatedEmptyState
        cardContent={
          <>
            <Hyperlink className="size-4 text-neutral-700" />
            <div className="h-2.5 w-24 min-w-0 rounded-sm bg-neutral-200" />
            <div className="xs:flex hidden grow items-center justify-end gap-1.5 text-neutral-500">
              <CursorRays className="size-3.5" />
            </div>
          </>
        }
        description={
          isFiltered
            ? "Bummer! There are no links that match your filters. Adjust your filters to yield more results."
            : "Start creating short links for your marketing campaigns, referral programs, and more."
        }
        title={isFiltered ? "No links found" : "No links yet"}
        {...(!isFiltered && {
          addButton: (
            <div>
              <CreateButton hotkey="c" href={"/cards/create"} label="Create Card" />
            </div>
          ),
          learnMoreHref: "https://dub.co/help/article/how-to-create-link",
          learnMoreClassName: "h-10",
        })}
      />
    );
  }

  return (
    <div
      className={cn(
        variant === "rows" ? "grid-cols-1" : "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      )}
    >
      {cards.map((card) => (
        <PersonCard
          card={card}
          isSelectMode={isSelectMode}
          key={card.id}
          setIsSelectMode={setIsSelectMode}
          variant={variant}
        />
      ))}
    </div>
  );
};
