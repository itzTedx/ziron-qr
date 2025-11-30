import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";
import { CreateButton } from "@/components/ui/create-button";

import { orpc } from "@/lib/orpc/client";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

import { CardsItems } from "../_components/organizations-items";

export default async function CardsPage() {
  "use cache";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.organization.list.queryOptions());
  return (
    <>
      <Header title="Cards">
        <CreateButton href={"/cards/create"} label="Create Card" />
      </Header>

      <section className="h-full flex-1">
        <ScrollArea className="h-full flex-1 overflow-y-auto pt-2 sm:pt-3">
          <div className="container">
            <HydrateClient client={queryClient}>
              <CardsItems />
              {/* <Suspense fallback={<div>Loading organizations...</div>}>
                <OrganizationsList />
              </Suspense> */}
            </HydrateClient>
          </div>

          <ScrollBar />
        </ScrollArea>
      </section>
    </>
  );
}
