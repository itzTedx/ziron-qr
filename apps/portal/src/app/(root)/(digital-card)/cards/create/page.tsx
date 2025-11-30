import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";

import { CardForm } from "@/features/card/components/card-form";

export default function CreateCardPage() {
  return (
    <>
      <Header backHref="/" currentPage="Create New Card" showBackButton title="Cards" />
      <section className="h-full flex-1">
        <ScrollArea className="h-full flex-1 overflow-y-auto">
          <CardForm />
          <ScrollBar />
        </ScrollArea>
      </section>
    </>
  );
}
