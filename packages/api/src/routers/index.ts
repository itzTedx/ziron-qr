import type { RouterClient as AppRouterClient } from "@orpc/server";

import { getAvatar, getAvatarV1 } from "./avatar";
import { checkSlugAvailability, createCard, deleteCard, getCard, getCardBySlug, listCards, updateCard } from "./card";
import { createCompany, listCompanies } from "./company";
import { generateQR } from "./qr";

export const router = {
  company: {
    create: createCompany,
    list: listCompanies,
  },
  card: {
    create: createCard,
    list: listCards,
    get: getCard,
    getBySlug: getCardBySlug,
    update: updateCard,
    checkSlug: checkSlugAvailability,
    delete: deleteCard,
  },
  avatar: {
    get: {
      v1: getAvatarV1,
      v2: getAvatar,
    },
  },
  qr: {
    generate: generateQR,
  },
};

export type Router = typeof router;
export type RouterClient = AppRouterClient<typeof router>;
