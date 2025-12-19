import { os } from "@orpc/server";

import { and, count, desc, eq, isNull } from "@ziron/db";
import { Card, type CardType, type CardWithPageVisits, cards, organizationTable, pageVisits } from "@ziron/db/schema";
import { workspacePreferencesSchema, z } from "@ziron/validators";

import { publicProcedure } from "../..";
import { dbProvider } from "../../middleware/db-provider";

export const listCards = os
	.use(dbProvider)
	.route({
		method: "GET",
		path: "/card",
		summary: "List all cards",
		description: "List all cards with their company",
		tags: ["card"],
	})
	.input(
		workspacePreferencesSchema.optional().default({ viewMode: "cards", sortBy: "createdAt", showArchived: false })
	)
	.output(z.array(z.custom<CardWithPageVisits>()))
	.handler(async ({ context, input }) => {
		const filters = input ?? {};

		const conditions = [isNull(cards.deletedAt)];

		if (filters.showArchived === false) {
			conditions.push(isNull(cards.archivedAt));
		}
		// When showArchived === true, show all cards (no filter needed)

		// For "organization" and "clicks" sorting, we need to use SQL builder
		// because relational query API doesn't support ordering by related columns or aggregates
		if (filters.sortBy === "organization" || filters.sortBy === "clicks") {
			let sortedCardIds: { id: string }[];

			if (filters.sortBy === "organization") {
				sortedCardIds = await context.db
					.select({
						id: cards.id,
					})
					.from(cards)
					.leftJoin(organizationTable, eq(cards.organizationId, organizationTable.id))
					.where(and(...conditions))
					.orderBy(desc(organizationTable.name));
			} else {
				// filters.sortBy === "clicks"
				sortedCardIds = await context.db
					.select({
						id: cards.id,
					})
					.from(cards)
					.leftJoin(pageVisits, eq(cards.id, pageVisits.cardId))
					.where(and(...conditions))
					.groupBy(cards.id)
					.orderBy(desc(count(pageVisits.id)));
			}

			// Fetch full card data with relations using relational query API
			const cardIds = sortedCardIds.map((row) => row.id);
			if (cardIds.length === 0) {
				return [];
			}

			// Fetch only the sorted cards with relations using relational query API
			// We fetch all matching cards and filter in memory to maintain sort order
			// (relational query API doesn't support ordering by the sorted IDs array)
			const allData = await context.db.query.cards.findMany({
				where: and(...conditions),
				with: {
					organization: true,
					pageVisits: {
						columns: {
							referer: true,
						},
					},
				},
			});

			// Maintain the sort order from the SQL query by mapping IDs to cards
			const cardMap = new Map(allData.map((card) => [card.id, card]));
			const sortedCards: CardWithPageVisits[] = [];
			for (const id of cardIds) {
				const card = cardMap.get(id);
				if (card) {
					sortedCards.push(card);
				}
			}
			return sortedCards;
		}

		// For "createdAt" sorting, use relational query API (simpler and works fine)
		const data = await context.db.query.cards.findMany({
			where: and(...conditions),
			orderBy: (cards, { desc }) => [desc(cards.createdAt)],
			with: {
				organization: true,
				emails: true,
				phones: true,
				links: true,
				appearance: true,
				pageVisits: {
					columns: {
						referer: true,
					},
				},
			},
		});

		return data;
	});

export const getCard = publicProcedure
	.use(dbProvider)
	.route({
		method: "GET",
		path: "/card/:id",
		summary: "Get a card by ID",
		description: "Get a card by ID",
		tags: ["card"],
	})
	.input(
		z.object({
			id: z.string().optional(),
		})
	)
	.output(z.custom<Partial<CardType>>().optional())
	.handler(async ({ input, context, errors }) => {
		const cardId = input.id;

		if (!cardId) {
			throw errors.BAD_REQUEST({ message: "Card ID is required" });
		}

		const data = await context.db.query.cards.findFirst({
			where: (cards, { eq, isNull, and }) =>
				and(eq(cards.id, cardId), isNull(cards.deletedAt), isNull(cards.archivedAt)),
			with: {
				emails: true,
				phones: true,
				links: true,
				organization: true,
				appearance: true,
			},
		});

		if (!data) throw errors.NOT_FOUND();

		return data;
	});

export const getCardBySlug = publicProcedure
	.use(dbProvider)
	.route({
		method: "GET",
		path: "/card/:slug",
		summary: "Get a card by Slug",
		description: "Get a card by Slug",
		tags: ["card"],
	})
	.input(z.object({ slug: z.string() }))
	.output(z.custom<CardType>())
	.handler(async ({ input, context, errors }) => {
		const data = await context.db.query.cards.findFirst({
			where: (cards, { eq, isNull, and }) =>
				and(eq(cards.slug, input.slug), isNull(cards.deletedAt), isNull(cards.archivedAt)),
			with: {
				emails: true,
				phones: true,
				links: true,
				organization: true,
				appearance: true,
			},
		});

		if (!data) throw errors.NOT_FOUND();

		return data;
	});

export const getAllCards = publicProcedure
	.use(dbProvider)
	.route({
		method: "GET",
		path: "/card/all",
		summary: "Get all cards",
		description: "Get all cards",
		tags: ["card"],
	})
	.output(z.array(z.custom<Card>()))
	.handler(async ({ context }) => {
		const data = await context.db.query.cards.findMany({
			where: (cards, { isNull, and }) => and(isNull(cards.deletedAt), isNull(cards.archivedAt)),
			with: {
				organization: true,
			},
		});
		return data;
	});

export const countCards = publicProcedure
	.use(dbProvider)
	.route({
		method: "GET",
		path: "/card/count",
		summary: "Count all cards",
		description: "Count all cards",
		tags: ["card"],
	})
	.input(z.object({ showArchived: z.boolean().optional() }).optional())
	.output(z.number())
	.handler(async ({ context, input }) => {
		const filters = input;

		// Build where conditions
		const conditions = [isNull(cards.deletedAt)];

		if (filters && filters.showArchived === false) {
			conditions.push(isNull(cards.archivedAt));
		}
		// When showArchived === true, show all cards (no filter needed)

		const [data] = await context.db
			.select({ count: count() })
			.from(cards)
			.where(and(...conditions));

		return data?.count ?? 0;
	});
