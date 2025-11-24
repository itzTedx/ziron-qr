import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CardTemplate from "@ziron/ui/templates/card-template";
import DefaultTemplate from "@ziron/ui/templates/default-template";
import ModernTemplate from "@ziron/ui/templates/modern-template";

import { Providers } from "@/components/providers";

import { client } from "@/lib/orpc/client";

import { CardType } from "../../../../../packages/db/src/schema/card-schema";

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const card = await client.card.getBySlug({ slug });
  if (!card)
    return {
      title: "No card found",
      description: "No card found",
      openGraph: {
        title: "No card found",
        description: "No card found",
      },
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

export default async function DigitalCardPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;

  const card = await client.card.getBySlug({ slug });

  if (!card) return notFound();
  return (
    <>
      <Template data={card} />
      <Providers isDarkMode={card.appearance.isDarkMode} />
    </>
  );
}

async function Template({ data }: { data: CardType }) {
  switch (data.appearance.template) {
    case "default":
      return <DefaultTemplate card={data} />;
    case "modern":
      return <ModernTemplate card={data} />;
    case "card":
      return <CardTemplate card={data} />;
    default:
      return <DefaultTemplate card={data} />;
  }
}
