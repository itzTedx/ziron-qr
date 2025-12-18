import { relations } from "drizzle-orm";
import { index, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { InferResultType } from "../client";
import { cards } from "./card-schema";

// Page visits table - tracks when a card page is viewed
export const pageVisits = pgTable(
	"page_visits",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		cardId: uuid("card_id")
			.notNull()
			.references(() => cards.id, { onDelete: "cascade" }),

		// Visitor information
		ipAddress: varchar("ip_address", { length: 45 }),
		userAgent: text("user_agent"),
		referer: text("referer"),

		// Location data
		country: varchar("country", { length: 2 }),
		city: varchar("city", { length: 255 }),

		// Device information
		deviceType: varchar("device_type", { length: 50 }), // mobile, desktop, tablet
		browser: varchar("browser", { length: 100 }),
		os: varchar("os", { length: 100 }),

		// Timestamps
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("page_visits_card_id_idx").on(table.cardId),
		index("page_visits_created_at_idx").on(table.createdAt),
		index("page_visits_card_id_created_at_idx").on(table.cardId, table.createdAt),
	]
);

// Events table - tracks user interactions (clicks, shares, downloads, etc.)
export const events = pgTable(
	"events",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		cardId: uuid("card_id")
			.notNull()
			.references(() => cards.id, { onDelete: "cascade" }),

		// Event information
		eventType: varchar("event_type", { length: 100 }).notNull(), // click, share, download, phone_call, email, etc.
		eventName: varchar("event_name", { length: 255 }), // e.g., "phone_click", "email_click", "link_click", "share_facebook"

		// Event metadata (flexible JSON for additional data)
		metadata: jsonb("metadata"), // e.g., { linkId: "uuid", linkUrl: "https://...", platform: "facebook" }

		// Visitor information
		ipAddress: varchar("ip_address", { length: 45 }),
		userAgent: text("user_agent"),

		// Device information
		deviceType: varchar("device_type", { length: 50 }),
		browser: varchar("browser", { length: 100 }),
		os: varchar("os", { length: 100 }),

		// Timestamps
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("events_card_id_idx").on(table.cardId),
		index("events_event_type_idx").on(table.eventType),
		index("events_created_at_idx").on(table.createdAt),
		index("events_card_id_event_type_idx").on(table.cardId, table.eventType),
		index("events_card_id_created_at_idx").on(table.cardId, table.createdAt),
	]
);

// Relations
export const pageVisitsRelations = relations(pageVisits, ({ one }) => ({
	card: one(cards, {
		fields: [pageVisits.cardId],
		references: [cards.id],
	}),
}));

export const eventsRelations = relations(events, ({ one }) => ({
	card: one(cards, {
		fields: [events.cardId],
		references: [cards.id],
	}),
}));

// Types
export type PageVisit = InferResultType<"pageVisits">;
export type Event = InferResultType<"events">;
