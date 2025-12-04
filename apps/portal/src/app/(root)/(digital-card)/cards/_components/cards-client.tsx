"use client";

import { Suspense, useMemo, useState } from "react";

import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ziron/ui/components/input-group";

import { PageWidthWrapper } from "@/components/layout/page-width-wrapper";
import { AnimateIcon } from "@/components/ui/icon";

import { IconSlidersHorizontal } from "@/assets/icons";

import { orpc } from "@/lib/orpc/client";

import { CardsItems } from "../../_components/organizations-items";
import { selectedSortAtom, showArchivedAtom, viewModeAtom } from "./cards-atoms";
import { CardsDisplay } from "./cards-display";
import { CardsToolbar } from "./cards-toolbar";
import { MoreCardOptions } from "./more-card-options";

export const CardsClient = () => {
  // Fetch preferences from database
  const { data: preferences } = useSuspenseQuery(orpc.workspace.getPreferences.queryOptions());

  // Initialize atoms with preferences when they load
  // useHydrateAtoms only hydrates once per store, so this is safe to call on every render
  const hydrateValues = useMemo(() => {
    if (!preferences) return new Map();
    // Build Map entry by entry to avoid TypeScript inference issues with mixed atom types
    const map = new Map();
    map.set(viewModeAtom, preferences.viewMode ?? "cards");
    map.set(showArchivedAtom, preferences.showArchived ?? false);
    map.set(selectedSortAtom, preferences.sortBy ?? "createdAt");
    return map;
  }, [preferences]);

  useHydrateAtoms(hydrateValues);

  return (
    <PageWidthWrapper className="flex flex-col gap-y-3 sm:gap-y-4">
      <div className="flex flex-wrap items-center gap-2 sm:justify-between">
        <ButtonGroup className="w-full sm:w-fit">
          <AnimateIcon animateOnHover asChild>
            <Button className="w-full flex-1 bg-inherit" size="lg" variant="outline">
              <IconSlidersHorizontal /> Filter <IconChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </AnimateIcon>
          <CardsDisplay />
        </ButtonGroup>

        <ButtonGroup className="w-full sm:w-fit">
          <ButtonGroup className="w-full sm:w-fit">
            <InputGroup className="h-10 w-full">
              <InputGroupInput placeholder="Search cards" />
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>
          </ButtonGroup>

          <MoreCardOptions />
        </ButtonGroup>
      </div>
      <Suspense>
        <CardsClientContent />
      </Suspense>
    </PageWidthWrapper>
  );
};

const CardsClientContent = () => {
  const showArchived = useAtomValue(showArchivedAtom);
  const viewMode = useAtomValue(viewModeAtom);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedCardsId, setSelectedCardsId] = useState<string[]>([]);

  const { data: cards } = useSuspenseQuery(orpc.card.list.queryOptions());
  const { data: cardsCount } = useSuspenseQuery(
    orpc.card.count.queryOptions({ input: { showArchived: showArchived ? true : false } })
  );

  return (
    <>
      <CardsItems cards={cards} isSelectMode={isSelectMode} setIsSelectMode={setIsSelectMode} variant={viewMode} />

      <CardsToolbar
        cards={cards}
        cardsCount={cardsCount}
        isSelectMode={isSelectMode}
        selectedCardsId={selectedCardsId}
        setIsSelectMode={setIsSelectMode}
        setSelectedCardsId={setSelectedCardsId}
      />
    </>
  );
};
