import type { RouterClient as AppRouterClient } from "@orpc/server";

import { getCardAnalytics, trackEvent, trackPageVisit } from "./analytics";
import { getAvatar, getAvatarV1 } from "./avatar";
import { checkSlugAvailability, createCard, deleteCard, getCard, getCardBySlug, listCards, updateCard } from "./card";
import { createCompany, listCompanies } from "./company";
import { getMetrics } from "./metrics";
import { generateQR } from "./qr";

export const router = {
  metrics: {
    get: getMetrics,
  },
  company: {
    create: createCompany,
    list: listCompanies,
  },
  card: {
    create: createCard,
    list: listCards,
    get: getCard,

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
  analytics: {
    getCardAnalytics: getCardAnalytics,
  },
};

export const clientRouter = {
  card: {
    getBySlug: getCardBySlug,
  },
  analytics: {
    trackPageVisit: trackPageVisit,
    trackEvent: trackEvent,
  },
};

export type Router = typeof router;
export type RouterClient = AppRouterClient<typeof router>;

export type ClientRouter = typeof clientRouter;
export type ClientRouterClient = AppRouterClient<typeof clientRouter>;
