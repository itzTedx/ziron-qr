import { and, count, desc, eq, isNull } from "@ziron/db";
import { cards, Organization, organizationTable } from "@ziron/db/schema";
import { slugify } from "@ziron/utils";
import { organizationSchema, z } from "@ziron/validators";

import { protectedProcedure, publicProcedure } from "..";
import { dbProvider } from "../middleware/db-provider";

export const createOrganization = protectedProcedure
	.use(dbProvider)
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
	.handler(async ({ input, errors, context }) => {
		const slug = slugify(input.name);

		try {
			const [organization] = await context.db
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

export const listOrganizations = publicProcedure
	.use(dbProvider)
	.route({
		method: "GET",
		path: "/organization",
		summary: "List all organizations",
		description: "List all organizations with their cards count",
		tags: ["organization"],
	})
	.output(z.array(z.custom<Organization>().and(z.object({ cardsCount: z.number() }))))
	.handler(async ({ context }) => {
		const data = await context.db
			.select({
				id: organizationTable.id,
				name: organizationTable.name,
				slug: organizationTable.slug,
				phone: organizationTable.phone,
				website: organizationTable.website,
				email: organizationTable.email,
				address: organizationTable.address,
				logo: organizationTable.logo,
				createdAt: organizationTable.createdAt,
				updatedAt: organizationTable.updatedAt,
				deletedAt: organizationTable.deletedAt,
				cardsCount: count(cards.id),
			})
			.from(organizationTable)
			.leftJoin(
				cards,
				and(eq(cards.organizationId, organizationTable.id), isNull(cards.deletedAt), isNull(cards.archivedAt))
			)
			.where(isNull(organizationTable.deletedAt))
			.groupBy(organizationTable.id)
			.orderBy(desc(organizationTable.createdAt));

		return data.map(({ cardsCount, ...org }) => ({
			...org,
			cardsCount: cardsCount ?? 0,
		}));
	});

export const getOrganization = publicProcedure
	.use(dbProvider)
	.route({
		method: "GET",
		path: "/organization/:id",
		summary: "Get an organization by ID",
		description: "Get an organization by ID",
		tags: ["organization"],
	})
	.input(z.object({ id: z.string().optional().or(z.literal("new")) }))
	.output(z.custom<Organization>().nullable())
	.handler(async ({ input, errors, context }) => {
		if (input.id && input.id !== "new") {
			const data = await context.db.query.organizationTable.findFirst({
				where: (organization, { eq }) => eq(organization.id, input.id as string),
			});

			if (!data) throw errors.NOT_FOUND();

			return data;
		}

		return null;
	});

export const deleteOrganization = protectedProcedure
	.use(dbProvider)
	.route({
		method: "DELETE",
		path: "/organization/:id",
		summary: "Delete an organization by ID",
		description: "Delete an organization by ID",
		tags: ["organization"],
	})
	.input(z.object({ id: z.string() }))
	.output(z.object({ success: z.boolean(), organizationName: z.string() }))
	.handler(async ({ input, errors, context }) => {
		try {
			const [data] = await context.db
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
