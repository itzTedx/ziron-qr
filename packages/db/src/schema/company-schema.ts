import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { InferResultType } from "../client";

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  logo: text("logo"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deletedAt"),
});

export type Company = InferResultType<"companies">;
