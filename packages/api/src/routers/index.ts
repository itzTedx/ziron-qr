import type { RouterClient as AppRouterClient } from "@orpc/server";

import { getAvatar, getAvatarV1 } from "./avatar";
import { checkSlugAvailability, createCard, deleteCard, getCard, listCards, updateCard } from "./card";
import { createCompany, listCompanies } from "./company";

export const router = {
  company: {
    create: createCompany,
    list: listCompanies,
  },
  card: {
    create: createCard,
    checkSlug: checkSlugAvailability,
    update: updateCard,
    list: listCards,
    get: getCard,
    delete: deleteCard,
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
