"use server";

import { db } from "@ziron/db/client";
import { cardStyles, cards, emails, links, phones } from "@ziron/db/schema";
import { cardSchema, z } from "@ziron/validators";

import { createLog } from "@/lib/utils";

import { CARD_CACHE_DURATIONS, CARD_ORDERINGS, CARD_REDIS_KEYS, invalidateCardCaches, redisCache } from "./cache";
import { upsertArray } from "./helpers";

const log = createLog("Card");

export async function upsertCard(formData: unknown) {
  log.info("upsertCard called", { formData });
  const { success, data, error } = cardSchema.safeParse(formData);
  if (!success) {
    log.error("Validation failed", { error });
    return {
      success: false,
      error: "Invalid data",
      details: z.prettifyError(error),
    };
  }

  try {
    let card;
    let cardId;
    const now = new Date();
    log.info("Starting DB transaction for upsertCard", { data });
    // All DB operations in a transaction
    const result = await db.transaction(async (tx) => {
      // Ensure required fields are not undefined
      const cardData = {
        id: data.id,
        name: data.name,
        slug: data.slug ?? data.name.toLowerCase().replace(/\s+/g, "-"),
        bio: data.bio ?? null,
        designation: data.designation ?? null,
        address: data.address ?? null,
        mapUrl: data.mapUrl ?? null,
        image: data.image ?? "", // required
        cover: data.cover ?? "", // required
        attachmentUrl: data.attachmentUrl ?? null,
        attachmentFileName: data.attachmentFileName ?? null,
        companyId: data.companyId,
        createdAt: data.id ? undefined : now,
        updatedAt: now,
      };

      log.info("Upserting card", { cardData });
      if (data.id) {
        card = await tx
          .insert(cards)
          .values(cardData)
          .onConflictDoUpdate({
            target: cards.id,
            set: { ...cardData, createdAt: undefined, updatedAt: now },
          })
          .returning();
      } else {
        card = await tx.insert(cards).values(cardData).returning();
      }

      cardId = card?.[0]?.id;
      if (!cardId) {
        log.error("Upsert failed, no card returned from database.");
        // Throw to rollback transaction
        throw new Error("Upsert failed, no card returned from database.");
      }

      // Upsert cardStyles (appearance)
      if (data.appearance) {
        log.info("Upserting cardStyles", {
          cardId,
          appearance: data.appearance,
        });
        await tx
          .insert(cardStyles)
          .values({
            cardId,
            template: data.appearance.template,
            theme: data.appearance.theme ?? "#4938ff",
            btnColor: data.appearance.btnColor ?? "#4938ff",
            isDarkMode: data.appearance.isDarkMode ?? false,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: cardStyles.cardId,
            set: {
              template: data.appearance.template,
              theme: data.appearance.theme ?? "#4938ff",
              btnColor: data.appearance.btnColor ?? "#4938ff",
              isDarkMode: data.appearance.isDarkMode ?? false,
              updatedAt: now,
            },
          });
      }

      log.info("Upserting phones", { phones: data.phones });
      await upsertArray(
        phones,
        data.phones,
        (item: { phone?: string; label: string }) => ({
          phone: item.phone ?? null,
          label: item.label,
        }),
        cardId,
        tx
      );

      log.info("Upserting emails", { emails: data.emails });
      await upsertArray(
        emails,
        data.emails,
        (item: { email?: string; label: string }) => ({
          email: item.email ?? null,
          label: item.label,
        }),
        cardId,
        tx
      );

      log.info("Upserting links", { links: data.links });
      await upsertArray(
        links,
        data.links,
        (item: { label: string; url: string; icon: string; category?: string }) => ({
          label: item.label,
          url: item.url,
          icon: item.icon,
          category: item.category ?? null,
        }),
        cardId,
        tx
      );

      // Return card and cardId for use after transaction
      log.success("DB transaction complete", { cardId });
      return { card, cardId };
    });

    log.info("Invalidating card caches", { cardId: result.cardId });
    // After upserting and before returning success, invalidate card caches
    await invalidateCardCaches(result.cardId);

    // Set card cache for CARD_BY_ID
    const cardCacheKey = CARD_REDIS_KEYS.CARD_BY_ID(result.cardId);
    log.info("Setting card cache", {
      cardCacheKey,
      duration: CARD_CACHE_DURATIONS.MEDIUM,
    });
    await redisCache.set(cardCacheKey, result.card[0], CARD_CACHE_DURATIONS.MEDIUM);

    // Optionally, update all card list caches (invalidate and repopulate)
    for (const order of CARD_ORDERINGS) {
      const listCacheKey = CARD_REDIS_KEYS.CARDS(order);
      log.info("Deleting card list cache for order", { order, listCacheKey });
      await redisCache.del(listCacheKey);
    }

    log.success("upsertCard success", { card: result.card[0] });
    return {
      success: true,
      data: result.card[0],
    };
  } catch (error) {
    log.error("Failed to upsert card", { error });
    return {
      success: false,
      error: "Failed to upsert card",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}
