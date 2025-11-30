import { Suspense } from "react";

import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";
import { Skeleton } from "@ziron/ui/components/skeleton";

import { truncate } from "@ziron/utils";

import Header from "@/components/layout/header";

import { CardForm } from "@/features/card/components/card-form";
import { client, orpc } from "@/lib/orpc/client";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

import { CardActionsDropdown } from "../../_components/card-actions-dropdown";
import { ClicksVisits } from "../../_components/clicks-visits";
import { CopyLinkButton } from "../../_components/copy-link-button";

interface CardPageContentProps {
  params: PageProps<"/cards/[id]">["params"];
}

async function SuspenseCardPageHeader({ params }: CardPageContentProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.analytics.getCardAnalytics.queryOptions({ input: { cardId: id } }));

  const isEditMode = id !== "create";

  // Fetching the card if in edit mode
  const card = isEditMode ? await client.card.get({ id }) : undefined;

  const PAGE_TITLE = isEditMode
    ? (`${truncate(card?.organization.name!, 5)}/${card?.name}` as const)
    : ("Create New Card" as const);

  return (
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
  );
}

async function SuspenseCardPageContent({ params }: CardPageContentProps) {
  "use cache";
  const { id } = await params;

  const isEditMode = id !== "new";

  // Fetching the card if in edit mode
  const card = isEditMode ? await client.card.get({ id }) : undefined;

  return (
    <>
      <section className="h-full flex-1">
        <ScrollArea className="h-full flex-1 overflow-y-auto">
          <CardForm initialData={card} isEditMode={isEditMode} />
          <ScrollBar />
        </ScrollArea>
      </section>
    </>
  );
}

export function CardPageHeader({ params }: CardPageContentProps) {
  return (
    <Suspense fallback={<CardPageHeaderSkeleton />}>
      <SuspenseCardPageHeader params={params} />
    </Suspense>
  );
}

export function CardPageContent({ params }: CardPageContentProps) {
  return <SuspenseCardPageContent params={params} />;
}

export function CardPageHeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between gap-3 overflow-hidden border-b bg-stone-50 px-6 py-2 backdrop-blur-2xl sm:h-16 dark:bg-stone-950">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-20 max-md:hidden" />
        <Skeleton className="h-9 w-9" />
      </div>
    </header>
  );
}
