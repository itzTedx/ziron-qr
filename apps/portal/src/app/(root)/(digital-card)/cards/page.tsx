import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";
import { CreateButton } from "@/components/ui/create-button";

import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/orpc/query/hydration";

import { CardsClient } from "./_components/cards-client";

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
          <CardsClient />

          <ScrollBar />
        </ScrollArea>
      </section>
    </>
  );
}
