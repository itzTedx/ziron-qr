import { Metadata } from "next";
import { notFound } from "next/navigation";

import Header from "@/components/layout/header";

import { CardForm } from "@/features/card/components/card-form";
import { client } from "@/lib/orpc/client";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

import { ClicksVisits } from "../_components/clicks-visits";
import { CopyLinkButton } from "../_components/copy-link-button";

export const dynamic = "force-dynamic";

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

  const companies = await client.company.list();
  // Fetching the card based on the ID
  const card = await client.card.get({ id });
  if (!card && id !== "new") {
    return notFound();
  }

  const isEditMode = id !== "new";

  return (
    <div>
      <Header currentPage={isEditMode ? `${card?.company.name} / ${card?.name}` : "Create New Card"} title="Cards">
        {isEditMode ? (
          <>
            <CopyLinkButton slug={card?.slug} />
            <HydrateClient client={queryClient}>
              <ClicksVisits cardId={id} />
            </HydrateClient>
          </>
        ) : (
          "Create Card"
        )}
      </Header>
      <CardForm companies={companies} initialData={card} isEditMode={isEditMode} />
    </div>
  );
}
