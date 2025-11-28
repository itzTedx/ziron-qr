import { eq } from "@ziron/db";
import { db } from "@ziron/db/client";
import { Organization, OrganizationWithCards, organizationTable } from "@ziron/db/schema";
import { slugify } from "@ziron/utils";
import { organizationSchema, z } from "@ziron/validators";

import { protectedProcedure } from "..";

export const createOrganization = protectedProcedure
  .route({
    method: "POST",
    path: "/organization",
    summary: "Create a new organization",
    description: "Create a new organization with the given name, phone, website, address, and logo",
    successStatus: 200,

    tags: ["organization"],
  })
  .input(organizationSchema)
  .output(
    z.object({
      organizationName: z.string(),
    })
  )
  .handler(async ({ input, errors }) => {
    const slug = slugify(input.name);

    try {
      const [organization] = await db
        .insert(organizationTable)
        .values({
          ...input,
          slug,
        })
        .returning({
          name: organizationTable.name,
        });

      return {
        organizationName: organization?.name ?? "",
      };
    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

export const listOrganizations = protectedProcedure
  .route({
    method: "GET",
    path: "/organization",
    summary: "List all organizations",
    description: "List all organizations with their cards",
    tags: ["organization"],
  })
  .output(z.array(z.custom<OrganizationWithCards>()))
  .handler(async () => {
    const data = await db.query.organizationTable.findMany({
      where: (organization, { isNull }) => isNull(organization.deletedAt),
      with: {
        cards: {
          where: (cards, { isNull, and }) => and(isNull(cards.deletedAt), isNull(cards.archivedAt)),
        },
      },
      // orderBy: getOrder(input.orderBy),
    });

    return data;
  });

export const getOrganization = protectedProcedure
  .route({
    method: "GET",
    path: "/organization/:id",
    summary: "Get an organization by ID",
    description: "Get an organization by ID",
    tags: ["organization"],
  })
  .input(z.object({ id: z.string().optional().or(z.literal("new")) }))
  .output(z.custom<Organization>().nullable())
  .handler(async ({ input, errors }) => {
    if (input.id && input.id !== "new") {
      const data = await db.query.organizationTable.findFirst({
        where: (organization, { eq }) => eq(organization.id, input.id as string),
      });

      if (!data) throw errors.NOT_FOUND();

      return data;
    }

    return null;
  });

export const deleteOrganization = protectedProcedure
  .route({
    method: "DELETE",
    path: "/organization/:id",
    summary: "Delete an organization by ID",
    description: "Delete an organization by ID",
    tags: ["organization"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ success: z.boolean(), organizationName: z.string() }))
  .handler(async ({ input, errors }) => {
    try {
      const [data] = await db
        .update(organizationTable)
        .set({ deletedAt: new Date() })
        .where(eq(organizationTable.id, input.id))
        .returning({
          name: organizationTable.name,
        });

      if (!data) throw errors.NOT_FOUND();

      return { success: true, organizationName: data.name };
    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
