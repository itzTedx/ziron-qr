import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid("id").primaryKey().defaultRandom().notNull();
export const createdAt = timestamp("created_at").defaultNow().notNull();
export const updatedAt = timestamp("updated_at", { withTimezone: true })
  .defaultNow()
  .$onUpdate(() => new Date());
export const deletedAt = timestamp("deleted_at", { withTimezone: true });
export const archivedAt = timestamp("archived_at", { withTimezone: true });
