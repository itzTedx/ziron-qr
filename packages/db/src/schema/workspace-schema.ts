import { index, json, pgTable } from "drizzle-orm/pg-core";

import { type CardsSortSlug, type CardsViewMode } from "@ziron/validators";

import { createdAt, id, updatedAt } from "./helper";

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
