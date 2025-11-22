import type { RouterClient as AppRouterClient } from "@orpc/server";

import { createCard, listCards } from "./card";
import { createCompany, listCompanies } from "./company";

export const router = {
  company: {
    create: createCompany,
    list: listCompanies,
  },
  card: {
    create: createCard,
    list: listCards,
  },
};

export type Router = typeof router;
export type RouterClient = AppRouterClient<typeof router>;
