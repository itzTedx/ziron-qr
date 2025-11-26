import { db } from "@ziron/db/client";
import { z } from "@ziron/validators";

import { protectedProcedure } from "..";

export const getMetrics = protectedProcedure
  .route({
    method: "GET",
    path: "/metrics",
    summary: "Get usage metrics",
    description: "Get usage metrics including total companies and cards",
    tags: ["metrics"],
  })
  .output(
    z.object({
      totalCompanies: z.number(),
      totalCards: z.number(),
    })
  )
  .handler(async ({ errors }) => {
    try {
      const [companiesList, cardsList] = await Promise.all([
        db.query.companies.findMany({
          where: (companies, { isNull }) => isNull(companies.deletedAt),
          columns: {
            id: true,
          },
        }),
        db.query.cards.findMany({
          where: (cards, { isNull }) => isNull(cards.deletedAt),
          columns: {
            id: true,
          },
        }),
      ]);

      return {
        totalCompanies: companiesList.length,
        totalCards: cardsList.length,
      };
    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
