import { db } from "@ziron/db/client";
import { Company, companies } from "@ziron/db/schema";
import { slugify } from "@ziron/utils";
import { companySchema, z } from "@ziron/validators";

import { protectedProcedure } from "..";
import { COMPANY_ORDERINGS, getOrder } from "../utils/company-ordering";

export const createCompany = protectedProcedure
  .route({ method: "POST", path: "/company", summary: "Create a new company", tags: ["company"] })
  .input(companySchema)
  .output(
    z.object({
      companyName: z.string(),
    })
  )
  .handler(async ({ input, errors }) => {
    const slug = slugify(input.name);

    try {
      const [company] = await db
        .insert(companies)
        .values({
          ...input,
          slug,
        })
        .returning({
          name: companies.name,
        });

      return {
        companyName: company?.name ?? "",
      };
    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
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
      orderBy: z.enum(COMPANY_ORDERINGS).optional(),
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
