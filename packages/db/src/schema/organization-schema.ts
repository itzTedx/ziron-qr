import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { InferResultType } from "../client";
import { cards } from "./card-schema";

export const organizationTable = pgTable(
	"organization",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),

		// Core company information
		name: varchar("name", { length: 255 }).notNull(),
		slug: varchar("slug", { length: 100 }).unique().notNull(),

		// Contact information
		phone: varchar("phone", { length: 20 }),
		website: varchar("website", { length: 255 }),
		email: varchar("email", { length: 255 }),

		// Address information
		address: text("address"),

		// Media
		logo: text("logo"),

		// Timestamps
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),
	},
	(table) => [
		index("organization_name_idx").on(table.name),
		index("organization_email_idx").on(table.email),
		index("organization_created_at_idx").on(table.createdAt),
		index("organization_deleted_at_idx").on(table.deletedAt),
		uniqueIndex("organization_slug_idx").on(table.slug),
	]
);

export const organizationRelations = relations(organizationTable, ({ many }) => ({
	cards: many(cards),
}));

export type OrganizationWithCards = InferResultType<
	"organizationTable",
	{
		cards: true;
	}
>;

export type Organization = typeof organizationTable.$inferSelect;

export type OrganizationWithCardsCount = Organization & { cardsCount: number };
