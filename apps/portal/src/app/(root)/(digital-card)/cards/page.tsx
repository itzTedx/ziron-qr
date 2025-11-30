import { Suspense } from "react";

import { IconChevronDown } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";
import { PageWidthWrapper } from "@/components/layout/page-width-wrapper";
import { CreateButton } from "@/components/ui/create-button";
import { AnimateIcon } from "@/components/ui/icon";

import { IconLayoutGrid, IconSlidersHorizontal } from "@/assets/icons";

import { orpc } from "@/lib/orpc/client";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

import { CardsItems } from "../_components/organizations-items";

export default async function CardsPage() {
  "use cache";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.card.list.queryOptions());
  return (
    <>
      <Header title="Cards">
        <CreateButton hotkey="c" href={"/cards/create"} label="Create Card" />
      </Header>

      <section className="h-full flex-1">
        <ScrollArea className="h-full flex-1 overflow-y-auto pt-3 sm:py-4">
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
            <HydrateClient client={queryClient}>
              <Suspense fallback={<div>Loading cards...</div>}>
                <CardsItems />
              </Suspense>
            </HydrateClient>
          </PageWidthWrapper>

          <ScrollBar />
        </ScrollArea>
      </section>
    </>
  );
}
