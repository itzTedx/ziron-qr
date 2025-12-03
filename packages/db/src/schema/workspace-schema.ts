import { index, json, pgTable } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "./helper";

export const cardsViewModes = ["cards", "rows"] as const;
export type CardsViewMode = (typeof cardsViewModes)[number];

export const cardsSortOptions = [
  {
    display: "Date created",
    slug: "createdAt",
  },
  {
    display: "Total clicks",
    slug: "clicks",
  },
  {
    display: "Last clicked",
    slug: "lastClicked",
  },
  {
    display: "Total sales",
    slug: "saleAmount",
  },
] as const;

export type CardsSortSlug = (typeof cardsSortOptions)[number]["slug"];

export const workspaceTable = pgTable(
  "workspace",
  {
    id,

    workspacePreferences: json("workspace_preferences").$type<{
      viewMode: CardsViewMode;
      sortBy: CardsSortSlug;
      showArchived: boolean;
    }>(),
    createdAt,
    updatedAt,
  },
  (table) => [index("workspace_idx").on(table.id)]
);
