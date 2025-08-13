import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { InferResultType } from "../client";
import { cards } from "./card-schema";

export const companies = pgTable(
  "companies",
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
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("companies_name_idx").on(table.name),
    index("companies_email_idx").on(table.email),
    index("companies_created_at_idx").on(table.createdAt),
    index("companies_deleted_at_idx").on(table.deletedAt),
    uniqueIndex("companies_slug_idx").on(table.slug),
  ],
);

export const companyRelations = relations(companies, ({ many }) => ({
  cards: many(cards),
}));

export type Company = InferResultType<
  "companies",
  {
    cards: true;
  }
>;
