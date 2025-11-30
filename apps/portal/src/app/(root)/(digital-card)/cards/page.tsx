import { Suspense } from "react";

import { FileFormatIcon } from "@ziron/ui/components/file-format-icon";
import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";
import { CreateButton } from "@/components/ui/create-button";

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
        <ScrollArea className="h-full flex-1 overflow-y-auto pt-2 sm:pt-3">
          <div className="container">
            <HydrateClient client={queryClient}>
              <Suspense fallback={<div>Loading cards...</div>}>
                <CardsItems />
              </Suspense>
            </HydrateClient>
            <FileFormatIcon format="PDF" />
            <ScrollBar />
          </div>
        </ScrollArea>
      </section>
    </>
  );
}
