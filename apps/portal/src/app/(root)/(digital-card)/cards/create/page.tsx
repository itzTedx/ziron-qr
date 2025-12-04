import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";

import { CardForm } from "@/features/card/components/card-form";

// When using 'use cache' at file level, all exports must be async functions
export default async function CreateCardPage() {
  return (
    <>
      <Header backHref="/" currentPage={"Create New Card"} showBackButton title="Cards" />

      <ScrollArea className="flex-1 overflow-y-auto">
        <CardForm />
        <ScrollBar />
      </ScrollArea>
    </>
  );
}
