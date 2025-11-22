import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { ZodError } from "@ziron/validators";

export const productErrorAtom = atom<ZodError["issues"]>([]);

export const isEditModeAtom = atom<boolean>(false);

export const companyCollapsibleStateAtom = atomWithStorage<Record<string, boolean>>("company-collapsible-state", {});
