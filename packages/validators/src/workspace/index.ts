import { z } from "zod";

export const cardsViewModes = ["cards", "rows"] as const;
export type CardsViewMode = (typeof cardsViewModes)[number];

export const cardsSortOptions = [
	{
		display: "Date created",
		slug: "createdAt",
	},
	{
		display: "Organization",
		slug: "organization",
	},
	{
		display: "Total clicks",
		slug: "clicks",
	},
] as const;

export type CardsSortSlug = (typeof cardsSortOptions)[number]["slug"];

export const workspacePreferencesSchema = z.object({
	viewMode: z.enum(cardsViewModes),
	sortBy: z.enum(cardsSortOptions.map((opt) => opt.slug) as [CardsSortSlug, ...CardsSortSlug[]]),
	showArchived: z.boolean(),
});

export type WorkspacePreferences = z.infer<typeof workspacePreferencesSchema>;

export const updateWorkspacePreferencesSchema = workspacePreferencesSchema.partial();
