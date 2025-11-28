import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import { truncate } from "@ziron/utils";

import Header from "@/components/layout/header";

import { CardForm } from "@/features/card/components/card-form";
import { client } from "@/lib/orpc/client";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

import { CardActionsDropdown } from "../_components/card-actions-dropdown";
import { ClicksVisits } from "../_components/clicks-visits";
import { CopyLinkButton } from "../_components/copy-link-button";

export async function generateMetadata({ params }: PageProps<"/card/[id]">): Promise<Metadata> {
  const { id } = await params;
  const card = await client.card.get({ id });

  if (!card && id === "new")
    return {
      title: "Create New Card | Ziron Digital Card",
      description: "Create a new card to showcase your professional information",
    };

  if (!card)
    return {
      title: "Card Not Found | Ziron Digital Card",
      description: "Card not found",
    };

  const data = {
    title: `${card.name} - ${card.company.name} | Ziron Digital Card`,
    description: card.bio ?? "",
    icon: card.company.logo ?? undefined,
    twitterHandler: card.links.find((l) => l.label === "Twitter")?.url?.replace(/.*\.com\//, "@"),
  };

  return {
    title: data.title,
    description: data.description,

    openGraph: {
      title: data.title,
      description: data.description,
      images: [card.image ?? ""],
    },
  };
}

export default async function CardPage({ params }: PageProps<"/card/[id]">) {
  const { id } = await params;

  const queryClient = getQueryClient();

  // const companies = await client.company.list();
  // Fetching the card based on the ID
  const card = await client.card.get({ id });
  if (!card && id !== "new") {
    return notFound();
  }

  const isEditMode = id !== "new";

  const PAGE_TITLE = isEditMode
    ? (`${truncate(card?.company.name!, 5, { mobileOnly: true })}/${card?.name}` as const)
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
