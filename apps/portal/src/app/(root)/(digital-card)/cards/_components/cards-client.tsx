"use client";

import { Suspense } from "react";

import { IconChevronDown, IconLayoutGrid } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";

import { PageWidthWrapper } from "@/components/layout/page-width-wrapper";
import { AnimateIcon } from "@/components/ui/icon";

import { IconSlidersHorizontal } from "@/assets/icons";

import { CardsItems } from "../../_components/organizations-items";
import { CardsToolbar } from "./cards-toolbar";

export const CardsClient = () => {
  return (
    <PageWidthWrapper className="flex flex-col gap-y-3 sm:gap-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ButtonGroup>
          <AnimateIcon animateOnHover asChild>
            <Button className="bg-inherit" size="lg" variant="outline">
              <IconSlidersHorizontal /> Filter <IconChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </AnimateIcon>
          <AnimateIcon animateOnHover asChild>
            <Button className="bg-inherit" size="lg" variant="outline">
              <IconLayoutGrid /> Display <IconChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </AnimateIcon>
        </ButtonGroup>
      </div>
      <Suspense fallback={<div>Loading cards...</div>}>
        <CardsItems />
      </Suspense>

      <CardsToolbar
        cards={[]}
        cardsCount={4}
        isLoading={false}
        isSelectMode={true}
        selectedCardsId={[]}
        setIsSelectMode={() => {}}
        setSelectedCardsId={() => {}}
      />
    </PageWidthWrapper>
  );
};
