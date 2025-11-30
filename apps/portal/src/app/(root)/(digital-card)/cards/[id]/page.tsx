import { Metadata } from "next";

import { client } from "@/lib/orpc/client";

import { CardPageContent, CardPageHeader } from "./_components/card-page-content";

export async function generateMetadata({ params }: PageProps<"/card/[id]">): Promise<Metadata> {
  const { id } = await params;
  const card = await client.card.getBySlug({ slug: id });

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
    title: `${card.name} - ${card.organization.name} | Ziron Digital Card`,
    description: card.bio ?? "",
    icon: card.organization.logo ?? undefined,
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

export default function CardPage({ params }: PageProps<"/card/[id]">) {
  return (
    <>
      <CardPageHeader params={params} />
      <CardPageContent params={params} />
    </>
  );
}
