import { Suspense } from "react";

import type { Route } from "next";

import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";
import { CreateButton } from "@/components/ui/create-button";

import { OrganizationsList } from "@/features/organization/components/organizations-list";
import { orpc } from "@/lib/orpc/client";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

export default async function Page() {
  "use cache";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.organization.list.queryOptions());
  return (
    <>
      <Header title="Cards">
        <CreateButton href={"/card/new" as Route} label="Create Card" />
      </Header>

      <section className="h-full flex-1">
        <ScrollArea className="h-full flex-1 overflow-y-auto pt-2 sm:pt-3">
          <div className="gradient container">
            <HydrateClient client={queryClient}>
              <Suspense>
                <OrganizationsList />
              </Suspense>
            </HydrateClient>
          </div>

          <ScrollBar />
        </ScrollArea>
      </section>
    </>
  );
}
