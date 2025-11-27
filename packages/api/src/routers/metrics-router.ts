import { db } from "@ziron/db/client";
import { z } from "@ziron/validators";

import { protectedProcedure } from "..";

export const getMetrics = protectedProcedure
  .route({
    method: "GET",
    path: "/metrics",
    summary: "Get usage metrics",
    description: "Get usage metrics including total companies, cards, and events",
    tags: ["metrics"],
  })
  .output(
    z.object({
      totalCompanies: z.number(),
      totalCards: z.number(),
      totalEvents: z.number(),
      totalPageVisits: z.number(),
    })
  )
  .handler(async ({ errors }) => {
    try {
      const [companiesList, cardsList, eventsList, pageVisitsList] = await Promise.all([
        db.query.companies.findMany({
          where: (companies, { isNull }) => isNull(companies.deletedAt),
          columns: {
            id: true,
          },
        }),
        db.query.cards.findMany({
          where: (cards, { isNull, and }) => and(isNull(cards.deletedAt), isNull(cards.archivedAt)),
          columns: {
            id: true,
          },
        }),
        db.query.events.findMany({
          columns: {
            id: true,
          },
        }),
        db.query.pageVisits.findMany({
          columns: {
            id: true,
          },
        }),
      ]);

      return {
        totalCompanies: companiesList.length,
        totalCards: cardsList.length,
        totalEvents: eventsList.length,
        totalPageVisits: pageVisitsList.length,
      };
    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
