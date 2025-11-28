import { db } from "@ziron/db/client";
import { Company, CompanyWithCards, companies } from "@ziron/db/schema";
import { slugify } from "@ziron/utils";
import { companySchema, z } from "@ziron/validators";

import { protectedProcedure } from "..";

export const createCompany = protectedProcedure
  .route({
    method: "POST",
    path: "/company",
    summary: "Create a new company",
    description: "Create a new company with the given name, phone, website, address, and logo",
    successStatus: 200,

    tags: ["company"],
  })
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
    description: "List all companies with their cards",
    tags: ["company"],
  })
  .output(z.array(z.custom<CompanyWithCards>()))
  .handler(async () => {
    const data = await db.query.companies.findMany({
      where: (companies, { isNull }) => isNull(companies.deletedAt),
      with: {
        cards: {
          where: (cards, { isNull, and }) => and(isNull(cards.deletedAt), isNull(cards.archivedAt)),
        },
      },
      // orderBy: getOrder(input.orderBy),
    });

    return data;
  });

export const getCompany = protectedProcedure
  .route({
    method: "GET",
    path: "/company/:id",
    summary: "Get a company by ID",
    description: "Get a company by ID",
    tags: ["company"],
  })
  .input(z.object({ id: z.string().optional().or(z.literal("new")) }))
  .output(z.custom<Company>().nullable())
  .handler(async ({ input, errors }) => {
    if (input.id && input.id !== "new") {
      const data = await db.query.companies.findFirst({
        where: (companies, { eq }) => eq(companies.id, input.id as string),
      });

      if (!data) throw errors.NOT_FOUND();

      return data;
    }

    return null;
  });
