import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { createJsonCookieStorage } from "@/lib/storage/cookie-storage";

// Create a JSON-aware cookie storage for storing the collapsible state object
const jsonCookieStorage = createJsonCookieStorage<Record<string, boolean>>();

const initialValue: Record<string, boolean> = {};

export const companyCollapsibleStateAtom = atomWithStorage("company-collapsible-state", initialValue, {
  getItem: (key, initialVal) => {
    const value = jsonCookieStorage.getItem(key);
    return value ?? initialVal;
  },
  setItem: (key, value) => {
    jsonCookieStorage.setItem(key, value);
  },
  removeItem: (key) => {
    jsonCookieStorage.removeItem(key);
  },
});

// Share modal data type
export interface ShareModalData {
  url: string;
  name: string;
  logo?: string;
}

// Base atom for modal state and data
const shareModalAtomBase = atom<{ open: boolean; data: ShareModalData | null }>({
  open: false,
  data: null,
});

// Getter atom (read-only) - returns the full modal state
export const shareModalAtom = atom((get) => get(shareModalAtomBase));

// Setter atom (write-only) - accepts share data to open modal
export const openShareModalAtom = atom(null, (_get, set, data: ShareModalData) => {
  set(shareModalAtomBase, { open: true, data });
});

// Setter atom (write-only) - closes the modal
export const closeShareModalAtom = atom(null, (_get, set) => {
  set(shareModalAtomBase, { open: false, data: null });
});
