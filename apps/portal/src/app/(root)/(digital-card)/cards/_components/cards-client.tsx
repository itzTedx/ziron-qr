"use client";

import { Suspense, useCallback, useMemo, useState } from "react";

import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ziron/ui/components/input-group";

import { type CardsSortSlug } from "@ziron/validators";

import { PageWidthWrapper } from "@/components/layout/page-width-wrapper";
import { AnimateIcon } from "@/components/ui/icon";

import { IconSlidersHorizontal } from "@/assets/icons";

import { orpc } from "@/lib/orpc/client";

import { CardsItems } from "../../_components/organizations-items";
import { CardsDisplay } from "./cards-display";
import { CardsToolbar } from "./cards-toolbar";
import { MoreCardOptions } from "./more-card-options";

interface WorkspacePreferences {
  viewMode: "cards" | "rows";
  showArchived: boolean;
  sortBy: CardsSortSlug;
}

export const CardsClient = () => {
  // Fetch preferences from database
  const { data: preferences } = useSuspenseQuery(orpc.workspace.getPreferences.queryOptions());

  // Store original preferences for reset functionality
  const originalPreferences = useMemo<WorkspacePreferences>(
    () => ({
      viewMode: preferences.viewMode,
      showArchived: preferences.showArchived,
      sortBy: preferences.sortBy,
    }),
    [preferences.viewMode, preferences.showArchived, preferences.sortBy]
  );

  const [viewMode, setViewMode] = useState<"cards" | "rows">(preferences.viewMode);
  const [showArchived, setShowArchived] = useState(preferences.showArchived);
  const [selectedSort, setSelectedSort] = useState<CardsSortSlug>(preferences.sortBy);

  // Mutation to persist preferences
  const updatePreferences = useMutation(
    orpc.workspace.updatePreferences.mutationOptions({
      onSuccess: () => {
        toast.success("Display preferences saved");
      },
      onError: (error) => {
        toast.error("Failed to save preferences", { description: error.message });
      },
    })
  );

  const reset = useCallback(() => {
    setViewMode(originalPreferences.viewMode);
    setShowArchived(originalPreferences.showArchived);
    setSelectedSort(originalPreferences.sortBy);
  }, [originalPreferences]);

  const persist = useCallback(() => {
    updatePreferences.mutate({
      viewMode,
      showArchived,
      sortBy: selectedSort,
    });
  }, [viewMode, showArchived, selectedSort, updatePreferences]);

  return (
    <PageWidthWrapper className="flex flex-col gap-y-3 sm:gap-y-4">
      <div className="flex flex-wrap items-center gap-2 sm:justify-between">
        <ButtonGroup className="w-full sm:w-fit">
          <AnimateIcon animateOnHover asChild>
            <Button className="w-full flex-1 bg-inherit" size="lg" variant="outline">
              <IconSlidersHorizontal /> Filter <IconChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </AnimateIcon>
          <CardsDisplay
            initialData={preferences}
            persist={persist}
            reset={reset}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            setShowArchived={setShowArchived}
            setViewMode={setViewMode}
            showArchived={showArchived}
            viewMode={viewMode}
          />
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
        <CardsClientContent showArchived={showArchived} viewMode={viewMode} />
      </Suspense>
    </PageWidthWrapper>
  );
};

interface CardsClientContentProps {
  showArchived: boolean;
  viewMode: "cards" | "rows";
}

const CardsClientContent = ({ showArchived, viewMode }: CardsClientContentProps) => {
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
