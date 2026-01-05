import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CardTemplate from "@ziron/ui/templates/card-template";
import DefaultTemplate from "@ziron/ui/templates/default-template";
import ModernTemplate from "@ziron/ui/templates/modern-template";

import { CardTracker } from "@/components/card-tracker";
import { Theme } from "@/components/theme";

import { trackPageVisit } from "@/actions/analytics";
import { client } from "@/lib/orpc/client";

import { CardType } from "../../../../../packages/db/src/schema/card-schema";

export const revalidate = 60;

export async function generateStaticParams() {
	const cards = await client.card.getAll();
	return cards.map((card) => ({
		slug: card.slug,
	}));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
	const { slug } = await params;
	try {
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
			title: `${card.name} - ${card.organization?.name} | Ziron Digital Card`,
			description: card.bio ?? "",
			icon: card.organization?.logo ?? undefined,
			twitterHandler: card.links?.find((l) => l.label === "Twitter")?.url?.replace(/.*\.com\//, "@"),
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
	} catch {
		return {
			title: "No card found",
			description: "No card found",
			openGraph: {
				title: "No card found",
				description: "No card found",
			},
		};
	}
}

export default async function DigitalCardPage({ params }: PageProps<"/[slug]">) {
	const { slug } = await params;

	try {
		const card = await client.card.getBySlug({ slug });

		if (!card) return notFound();

		// Track page visit using server action with "after" function
		// This runs after the response is sent, non-blocking
		trackPageVisit(card.id);

		return (
			<>
				<CardTracker cardId={card.id}>
					<Template data={card} />
				</CardTracker>
				<Theme isDarkMode={card.appearance?.isDarkMode ?? false} />
			</>
		);
	} catch {
		return notFound();
	}
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

// TODO: Change the rendering logic something like below
// import WebDevelopment from './components/WebDevelopment';
// import SEO from './components/SEO';
// import GraphicDesign from './components/GraphicDesign';

// const serviceComponents: Record<string, React.FC> = {
//   'web-development': WebDevelopment,
//   'seo': SEO,
//   'graphic-design': GraphicDesign,
// };

// interface PageProps {
//   params: { slug: string };
// }

// export default function ServicePage({ params }: PageProps) {
//   const Component = serviceComponents[params.slug];

//   if (!Component) return <h1>Service Not Found</h1>;

//   return <Component />;
// }
