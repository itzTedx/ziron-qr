import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid("id").primaryKey().defaultRandom().notNull();
export const createdAt = timestamp("created_at").defaultNow().notNull();
export const updatedAt = timestamp("updated_at", { withTimezone: true })
  .defaultNow()
  .$onUpdate(() => new Date());
export const deletedAt = timestamp("deleted_at", { withTimezone: true });
export const archivedAt = timestamp("archived_at", { withTimezone: true });

export function generateId(orgName: string): string {
  const words = orgName.trim().split(/\s+/);

  let acronym: string;

  if (words.length === 1) {
    acronym = words[0]?.substring(0, 3).toUpperCase() ?? ""; // EX: ZIR
  } else {
    acronym = words.map((w) => w[0]?.toUpperCase() ?? "").join(""); // EX: ZM
  }

  const time = Date.now().toString().slice(-5);

  return `${acronym}-${time}`;
}
