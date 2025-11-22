import { db } from "@ziron/db/client";
import { Company } from "@ziron/db/schema";
import { companySchema, z } from "@ziron/validators";

import { protectedProcedure } from "..";
import { COMPANY_ORDERINGS, getOrder } from "../utils/company-ordering";

export const createCompany = protectedProcedure
  .route({ method: "POST", path: "/company", summary: "Create a new company", tags: ["company"] })
  .input(companySchema)
  .output(
    z.object({
      success: z.boolean(),
    })
  )
  .handler(async () => {
    return {
      success: true,
    };
  });

export const listCompanies = protectedProcedure
  .route({
    method: "GET",
    path: "/company",
    summary: "List all companies",
    tags: ["company"],
  })
  .input(
    z.object({
      orderBy: z.enum(COMPANY_ORDERINGS),
    })
  )
  .output(z.array(z.custom<Company>()))
  .handler(async ({ input }) => {
    const data = await db.query.companies.findMany({
      where: (companies, { isNull }) => isNull(companies.deletedAt),
      with: {
        cards: true,
      },
      orderBy: getOrder(input.orderBy),
    });

    return data;
  });
