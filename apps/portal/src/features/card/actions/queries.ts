import type { CardType } from "@ziron/db/schema";
import { db } from "@ziron/db/client";

import {
  CARD_CACHE_DURATIONS,
  CARD_REDIS_KEYS,
  CardOrdering,
  redisCache,
} from "./cache";

export async function getCards(orderBy: CardOrdering = "name_asc") {
  try {
    const cacheKey = CARD_REDIS_KEYS.CARDS(orderBy);
    const cached = await redisCache.get<CardType[]>(cacheKey);
    if (cached) {
      return cached;
    }

    let orderFn;
    switch (orderBy) {
      case "name_asc":
        orderFn = (cards: any, { asc }: { asc: any; desc: any }) =>
          asc(cards.name);
        break;
      case "name_desc":
        orderFn = (cards: any, { desc }: { asc: any; desc: any }) =>
          desc(cards.name);
        break;
      case "createdAt_asc":
        orderFn = (cards: any, { asc }: { asc: any; desc: any }) =>
          asc(cards.createdAt);
        break;
      case "createdAt_desc":
        orderFn = (cards: any, { desc }: { asc: any; desc: any }) =>
          desc(cards.createdAt);
        break;
      default:
        orderFn = (cards: any, { asc }: { asc: any; desc: any }) =>
          asc(cards.name);
    }

    const data = await db.query.cards.findMany({
      where: (cards, { isNull }) => isNull(cards.deletedAt),
      orderBy: orderFn,
      with: {
        emails: true,
        phones: true,
        company: true,
        links: true,
      },
    });

    await redisCache.set(cacheKey, data, CARD_CACHE_DURATIONS.LONG);

    return data;
  } catch (error) {
    console.log(error);
  }
}
