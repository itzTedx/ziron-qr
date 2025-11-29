import { Suspense } from "react";

import { notFound } from "next/navigation";

import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import { truncate } from "@ziron/utils";

import Header from "@/components/layout/header";

import { CardForm } from "@/features/card/components/card-form";
import { client, orpc } from "@/lib/orpc/client";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

import { CardActionsDropdown } from "../../_components/card-actions-dropdown";
import { ClicksVisits } from "../../_components/clicks-visits";
import { CopyLinkButton } from "../../_components/copy-link-button";

interface CardPageContentProps {
  params: PageProps<"/card/[id]">["params"];
}

async function CardPageContentInner({ params }: CardPageContentProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.analytics.getCardAnalytics.queryOptions({ input: { cardId: id } }));

  // Fetching the card based on the ID
  const card = await client.card.get({ id });
  if (!card && id !== "new") {
    return notFound();
  }

  const isEditMode = id !== "new";

  const PAGE_TITLE = isEditMode
    ? (`${truncate(card?.organization.name!, 5)}/${card?.name}` as const)
    : ("Create New Card" as const);

  return (
    <>
      <Header backHref="/" currentPage={PAGE_TITLE} showBackButton title="Cards">
        {isEditMode ? (
          <>
            <CopyLinkButton slug={card?.slug} />
            <HydrateClient client={queryClient}>
              <ClicksVisits cardId={id} className="max-md:hidden" />
            </HydrateClient>
            <CardActionsDropdown cardId={id} />
          </>
        ) : null}
      </Header>

      <section className="h-full flex-1">
        <ScrollArea className="h-full flex-1 overflow-y-auto">
          <CardForm initialData={card} isEditMode={isEditMode} />
          <ScrollBar />
        </ScrollArea>
      </section>
    </>
  );
}

export function CardPageContent({ params }: CardPageContentProps) {
  return (
    <Suspense fallback={<div>Loading card...</div>}>
      <CardPageContentInner params={params} />
    </Suspense>
  );
}
