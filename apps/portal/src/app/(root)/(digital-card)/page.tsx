import type { Route } from "next";
import { redirect } from "next/navigation";

import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";
import { CreateButton } from "@/components/ui/create-button";

import { isAdminUser } from "@/features/auth/actions/user";
import { CompaniesList } from "@/features/company/components/companies-list";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

export const dynamic = "force-dynamic";

export default async function Page() {
  const queryClient = getQueryClient();
  const isAdmin = await isAdminUser();

  if (!isAdmin) redirect("/unauthorized");

  return (
    <>
      <Header title="Cards">
        <CreateButton href={"/card/new" as Route} label="Create Card" />
      </Header>

      <section className="h-full flex-1">
        <ScrollArea className="container h-full flex-1 overflow-y-auto pt-3">
          <HydrateClient client={queryClient}>
            <CompaniesList />
          </HydrateClient>
          <ScrollBar />
        </ScrollArea>
      </section>
    </>
  );
}
