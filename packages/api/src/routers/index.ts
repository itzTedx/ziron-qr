import type { RouterClient as AppRouterClient } from "@orpc/server";

import { getAvatar, getAvatarV1 } from "./avatar";
import { createCard, getCard, listCards } from "./card";
import { createCompany, listCompanies } from "./company";

export const router = {
  company: {
    create: createCompany,
    list: listCompanies,
  },
  card: {
    create: createCard,
    list: listCards,
    get: getCard,
  },
  avatar: {
    get: {
      v1: getAvatarV1,
      v2: getAvatar,
    },
  },
};

export type Router = typeof router;
export type RouterClient = AppRouterClient<typeof router>;
