import type { RouterClient as AppRouterClient } from "@orpc/server";

import { getCardAnalytics, trackEvent, trackPageVisit } from "./analytics-router";
import { getAvatar, getAvatarV1 } from "./avatar-router";
import {
  archiveCard,
  checkSlugAvailability,
  createCard,
  deleteCard,
  duplicateCard,
  getCard,
  getCardBySlug,
  listCards,
  updateCard,
} from "./card-router";
import { getMetrics } from "./metrics-router";
import { createOrganization, deleteOrganization, getOrganization, listOrganizations } from "./organization-router";
import { generateQR } from "./qr-router";

export const router = {
  metrics: {
    get: getMetrics,
  },
  organization: {
    create: createOrganization,
    list: listOrganizations,
    get: getOrganization,
    delete: deleteOrganization,
  },
  card: {
    create: createCard,
    list: listCards,
    get: getCard,

    update: updateCard,
    duplicate: duplicateCard,
    checkSlug: checkSlugAvailability,
    archive: archiveCard,
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
