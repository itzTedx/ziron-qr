import { eq } from "@ziron/db";
import { db } from "@ziron/db/client";

// Helper to upsert array of related items
export async function upsertArray<T extends { id?: string }>(
  table: any,
  items: T[] | undefined,
  fields: (item: T) => Record<string, any>,
  cardId: string,
  dbOrTx: any = db
) {
  const now = new Date();

  if (!Array.isArray(items)) return;
  // Delete existing for this card
  await dbOrTx.delete(table).where(eq(table.cardId, cardId));
  // Insert new
  if (items.length > 0) {
    await dbOrTx.insert(table).values(
      items.map((item, idx) => ({
        ...fields(item),
        cardId,
        order: idx,
        createdAt: now,
        updatedAt: now,
      }))
    );
  }
}
