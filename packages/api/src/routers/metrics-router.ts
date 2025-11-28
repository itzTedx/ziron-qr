import { z } from "@ziron/validators";

import { protectedProcedure } from "..";
import { dbProvider } from "../middleware/db-provider";

export const getMetrics = protectedProcedure
  .use(dbProvider)
  .route({
    method: "GET",
    path: "/metrics",
    summary: "Get usage metrics",
    description: "Get usage metrics including total organizations, cards, and events",
    tags: ["metrics"],
  })
  .output(
    z.object({
      totalOrganizations: z.number(),
      totalCards: z.number(),
      totalEvents: z.number(),
      totalPageVisits: z.number(),
    })
  )
  .handler(async ({ errors, context }) => {
    try {
      const [organizationsList, cardsList, eventsList, pageVisitsList] = await Promise.all([
        context.db.query.organizationTable.findMany({
          where: (organization, { isNull }) => isNull(organization.deletedAt),
          columns: {
            id: true,
          },
        }),
        context.db.query.cards.findMany({
          where: (cards, { isNull, and }) => and(isNull(cards.deletedAt), isNull(cards.archivedAt)),
          columns: {
            id: true,
          },
        }),
        context.db.query.events.findMany({
          columns: {
            id: true,
          },
        }),
        context.db.query.pageVisits.findMany({
          columns: {
            id: true,
          },
        }),
      ]);

      return {
        totalOrganizations: organizationsList.length,
        totalCards: cardsList.length,
        totalEvents: eventsList.length,
        totalPageVisits: pageVisitsList.length,
      };
    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
