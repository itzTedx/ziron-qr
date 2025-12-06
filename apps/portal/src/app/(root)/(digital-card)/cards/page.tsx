import { IconChevronDown, IconSearch } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ziron/ui/components/input-group";
import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";
import { PageWidthWrapper } from "@/components/layout/page-width-wrapper";
import { CreateButton } from "@/components/ui/create-button";
import { AnimateIcon } from "@/components/ui/icon";

import { IconSlidersHorizontal } from "@/assets/icons";

import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/orpc/query/hydration";

import { CardsClientContent } from "./_components/cards-client";
import { CardsDisplay } from "./_components/cards-display";
import { MoreCardOptions } from "./_components/more-card-options";

export default async function CardsPage() {
  const queryClient = getQueryClient();

  // await queryClient.prefetchQuery(orpc.workspace.getPreferences.queryOptions());
  await queryClient.prefetchQuery(orpc.card.list.queryOptions());

  const preferences = await queryClient.fetchQuery(orpc.workspace.getPreferences.queryOptions());

  return (
    <>
      <Header title="Cards">
        <CreateButton hotkey="c" href={"/cards/create"} label="Create Card" />
      </Header>

      <ScrollArea className="h-full flex-1 overflow-y-auto pt-3 sm:py-4">
        <PageWidthWrapper className="flex flex-col gap-y-3 sm:gap-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:justify-between">
            <ButtonGroup className="w-full sm:w-fit">
              <AnimateIcon animateOnHover asChild>
                <Button
                  className="w-full flex-1 justify-between bg-inherit sm:justify-start"
                  size="lg"
                  variant="outline"
                >
                  <span className="flex items-center gap-2">
                    <IconSlidersHorizontal /> <span className="block">Filter</span>
                  </span>
                  <IconChevronDown className="size-4 text-muted-foreground" />
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

        <ScrollBar />
      </ScrollArea>
    </>
  );
}
