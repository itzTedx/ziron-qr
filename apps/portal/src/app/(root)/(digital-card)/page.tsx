import type { Route } from "next";

import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";
import { CreateButton } from "@/components/ui/create-button";

import { CompaniesList } from "@/features/company/components/companies-list";

export default async function Page() {
  return (
    <>
      <Header title="Cards">
        <CreateButton href={"/card/new" as Route} label="Create Card" />
      </Header>

      <section className="h-full flex-1">
        <ScrollArea className="container h-full flex-1 overflow-y-auto sm:pt-3">
          <CompaniesList />

          <ScrollBar />
        </ScrollArea>
      </section>
    </>
  );
}
