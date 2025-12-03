"use client";

import { Suspense, useState } from "react";

import {
  IconChevronDown,
  IconDotsVertical,
  IconLayoutGrid,
  IconLayoutList,
  IconSearch,
  IconTable,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ziron/ui/components/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ziron/ui/components/input-group";

import { PageWidthWrapper } from "@/components/layout/page-width-wrapper";
import { AnimateIcon } from "@/components/ui/icon";

import { IconSlidersHorizontal } from "@/assets/icons";

import { orpc } from "@/lib/orpc/client";

import { CardsItems } from "../../_components/organizations-items";
import { CardsToolbar } from "./cards-toolbar";

export const CardsClient = () => {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedCardsId, setSelectedCardsId] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "rows">("cards");

  const { data: cards, isLoading } = useSuspenseQuery(orpc.card.list.queryOptions());
  const { data: cardsCount } = useSuspenseQuery(orpc.card.count.queryOptions({ input: {} }));

  return (
    <PageWidthWrapper className="flex flex-col gap-y-3 sm:gap-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ButtonGroup>
          <AnimateIcon animateOnHover asChild>
            <Button className="bg-inherit" size="lg" variant="outline">
              <IconSlidersHorizontal /> Filter <IconChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </AnimateIcon>
          <DropdownMenu>
            <AnimateIcon animateOnHover asChild>
              <DropdownMenuTrigger asChild>
                <Button className="bg-inherit" size="lg" variant="outline">
                  <IconLayoutGrid /> Display <IconChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
            </AnimateIcon>
            <DropdownMenuContent className="md:w-80">
              <div className="grid grid-cols-2 gap-2">
                <DropdownMenuItem
                  className="flex flex-col items-center justify-center"
                  onClick={() => setViewMode("cards")}
                >
                  <IconLayoutList className="size-6 stroke-1.5" /> Cards
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex flex-col items-center justify-center"
                  onClick={() => setViewMode("rows")}
                >
                  <IconTable className="size-6 stroke-1.5" /> Rows
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>

        <ButtonGroup>
          <ButtonGroup>
            <InputGroup>
              <InputGroupInput placeholder="Search cards" />
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>
          </ButtonGroup>

          <ButtonGroup>
            <Button size="icon" variant="outline">
              <IconDotsVertical />
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </div>
      <Suspense fallback={<div>Loading cards...</div>}>
        <CardsItems isSelectMode={isSelectMode} setIsSelectMode={setIsSelectMode} variant={viewMode} />
      </Suspense>

      <Suspense fallback={<div>Loading cards toolbar...</div>}>
        <CardsToolbar
          cards={cards}
          cardsCount={cardsCount}
          isLoading={isLoading}
          isSelectMode={isSelectMode}
          selectedCardsId={selectedCardsId}
          setIsSelectMode={setIsSelectMode}
          setSelectedCardsId={setSelectedCardsId}
        />
      </Suspense>
    </PageWidthWrapper>
  );
};
