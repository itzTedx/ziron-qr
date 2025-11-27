import { relations } from "drizzle-orm";
import { boolean, index, pgTable, real, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { InferResultType } from "../client";
import { events, pageVisits } from "./analytics-schema";
import { companies } from "./company-schema";

export const cards = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    // Core card information
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).unique(),
    bio: text("bio"),
    designation: varchar("designation", { length: 255 }),

    // Contact information
    address: text("address"),
    mapUrl: varchar("map_url", { length: 500 }),

    // Media and attachments
    image: text("logo").notNull(),
    cover: text("cover").notNull(),
    attachmentUrl: text("attachment_url"),
    attachmentFileName: varchar("attachment_file_name", { length: 255 }),
    attachmentObjectKey: varchar("attachment_object_key", { length: 255 }),

    // Company relationship
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    index("cards_name_idx").on(table.name),
    index("cards_slug_idx").on(table.slug),
    index("cards_company_id_idx").on(table.companyId),
    index("cards_created_at_idx").on(table.createdAt),
    index("cards_deleted_at_idx").on(table.deletedAt),
    index("cards_archived_at_idx").on(table.archivedAt),
    uniqueIndex("cards_slug_unique_idx").on(table.slug),
  ]
);

// New card_styles table
export const appearance = pgTable(
  "card_appearance",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    cardId: uuid("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    template: varchar("template", { length: 50 }).default("default").notNull(),
    isDarkMode: boolean("is_dark_mode").default(false).notNull(),
    theme: varchar("theme_color", { length: 7 }).default("#4938ff").notNull(),
    btnColor: varchar("button_color", { length: 7 }).default("#4938ff").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("appearance_card_id_idx").on(table.cardId),
    uniqueIndex("appearance_card_id_unique_idx").on(table.cardId),
    index("appearance_template_idx").on(table.template),
    index("appearance_created_at_idx").on(table.createdAt),
    index("appearance_deleted_at_idx").on(table.deletedAt),
  ]
);

export const phones = pgTable(
  "phones",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    phone: varchar("phone", { length: 20 }),
    label: varchar("label", { length: 50 }).notNull().default("primary"),
    order: real("order").notNull(),
    cardId: uuid("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("phones_card_id_idx").on(table.cardId),
    index("phones_order_idx").on(table.order),
    index("phones_created_at_idx").on(table.createdAt),
    index("phones_deleted_at_idx").on(table.deletedAt),
  ]
);

export const emails = pgTable(
  "emails",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    email: varchar("email", { length: 255 }),
    label: varchar("label", { length: 50 }).notNull().default("primary"),
    order: real("order").notNull(),
    cardId: uuid("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("emails_card_id_idx").on(table.cardId),
    index("emails_order_idx").on(table.order),
    index("emails_created_at_idx").on(table.createdAt),
    index("emails_deleted_at_idx").on(table.deletedAt),
  ]
);

export const links = pgTable(
  "links",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    label: varchar("title", { length: 255 }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    icon: varchar("icon", { length: 100 }).notNull(),
    category: varchar("category", { length: 100 }),
    order: real("order").notNull(),
    cardId: uuid("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("links_card_id_idx").on(table.cardId),
    index("links_category_idx").on(table.category),
    index("links_order_idx").on(table.order),
    index("links_created_at_idx").on(table.createdAt),
    index("links_deleted_at_idx").on(table.deletedAt),
  ]
);

export const cardsRelations = relations(cards, ({ one, many }) => ({
  company: one(companies, {
    fields: [cards.companyId],
    references: [companies.id],
  }),
  links: many(links),
  emails: many(emails),
  phones: many(phones),
  appearance: one(appearance, {
    fields: [cards.id],
    references: [appearance.cardId],
    relationName: "appearance",
  }),
  pageVisits: many(pageVisits),
  events: many(events),
  // attachments: one(attachments),
}));

export const appearanceRelations = relations(appearance, ({ one }) => ({
  card: one(cards, {
    fields: [appearance.cardId],
    references: [cards.id],
    relationName: "appearanceCard",
  }),
}));

export const cardLinksRelations = relations(links, ({ one }) => ({
  card: one(cards, {
    fields: [links.cardId],
    references: [cards.id],
    relationName: "cardLinks",
  }),
}));

export const cardPhonesRelations = relations(phones, ({ one }) => ({
  card: one(cards, {
    fields: [phones.cardId],
    references: [cards.id],
    relationName: "cardPhones",
  }),
}));

export const cardEmailsRelations = relations(emails, ({ one }) => ({
  card: one(cards, {
    fields: [emails.cardId],
    references: [cards.id],
    relationName: "cardEmails",
  }),
}));

export type CardType = InferResultType<
  "cards",
  {
    emails: true;
    phones: true;
    company: true;
    links: true;
    appearance: true;
  }
>;
