import { atom } from "jotai";

import { type CardsSortSlug } from "@ziron/validators";

// Default values
const DEFAULT_VIEW_MODE = "cards" as const;
const DEFAULT_SHOW_ARCHIVED = false;
const DEFAULT_SORT: CardsSortSlug = "createdAt";

// Atoms for cards view state
export const viewModeAtom = atom<"cards" | "rows">(DEFAULT_VIEW_MODE);
export const showArchivedAtom = atom<boolean>(DEFAULT_SHOW_ARCHIVED);
export const selectedSortAtom = atom<CardsSortSlug>(DEFAULT_SORT);
