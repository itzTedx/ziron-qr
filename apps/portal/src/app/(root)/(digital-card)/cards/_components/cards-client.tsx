"use client";

import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ziron/ui/components/input-group";

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
    <PageWidthWrapper className="flex flex-col gap-y-3 sm:gap-y-4">
      <div className="flex flex-wrap items-center gap-2 sm:justify-between">
        <ButtonGroup className="w-full sm:w-fit">
          <AnimateIcon animateOnHover asChild>
            <Button className="w-full flex-1 bg-inherit" size="lg" variant="outline">
              <IconSlidersHorizontal /> Filter <IconChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </AnimateIcon>
          <CardsDisplay preferences={preferences} />
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

      <CardsClientContent />
    </PageWidthWrapper>
  );
};

const CardsClientContent = () => {
  const showArchived = useAtomValue(showArchivedAtom);
  const viewMode = useAtomValue(viewModeAtom);
  const selectedSort = useAtomValue(selectedSortAtom);

  const { data: cards, isLoading } = useQuery(
    orpc.card.list.queryOptions({ input: { viewMode, sortBy: selectedSort, showArchived } })
  );
  const { data: cardsCount } = useSuspenseQuery(
    orpc.card.count.queryOptions({ input: { showArchived: showArchived ? true : false } })
  );

  const { isSelectMode, setIsSelectMode, selectedCardIds } = useCardSelection(cards);

  return (
    <>
      <CardsList
        cards={cards}
        isSelectMode={isSelectMode}
        loading={isLoading}
        selectedCardIds={selectedCardIds}
        setIsSelectModeAction={setIsSelectMode}
        variant={viewMode}
      />

      {cards && (
        <CardsToolbar
          cards={cards}
          cardsCount={cardsCount}
          isSelectMode={isSelectMode}
          setIsSelectMode={setIsSelectMode}
        />
      )}
    </>
  );
};
