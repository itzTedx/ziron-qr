import type { RouterClient as AppRouterClient } from "@orpc/server";

import { createCompany, listCompanies } from "./company";

export const router = {
  company: {
    create: createCompany,
    list: listCompanies,
  },
};

export type Router = typeof router;
export type RouterClient = AppRouterClient<typeof router>;
