import { revalidatePath, revalidateTag } from "next/cache";

import redis from "@ziron/redis";

// Cache tags for card
export const CARD_CACHE_TAGS = {
  CARD: "card",
  CARDS: "cards",
  CARD_BY_ID: "card-by-id",
} as const;

// Cache durations
export const CARD_CACHE_DURATIONS = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 3600,
  VERY_LONG: 86400,
} as const;

export const CARD_ORDERINGS = ["name_asc", "name_desc", "createdAt_asc", "createdAt_desc"] as const;

export type CardOrdering = (typeof CARD_ORDERINGS)[number];

// Redis keys
export const CARD_REDIS_KEYS = {
  CARDS: (order: CardOrdering) => `cards:all:${order}`,
  CARD_BY_ID: (id: string) => `card:${id}`,
} as const;

// Redis cache utility
export const redisCache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error(`Redis get error for key ${key}:`, error);
      return null;
    }
  },
  async set<T>(key: string, data: T, ttl: number = CARD_CACHE_DURATIONS.MEDIUM): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error(`Redis set error for key ${key}:`, error);
    }
  },
  async del(...keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error("Redis deletion error:", error);
    }
  },
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error(`Redis pattern invalidation error for ${pattern}:`, error);
    }
  },
};

// Invalidate and revalidate helpers
export const revalidateCardCaches = (cardId?: string) => {
  revalidateTag(CARD_CACHE_TAGS.CARD);
  revalidateTag(CARD_CACHE_TAGS.CARDS);
  if (cardId) {
    revalidateTag(`${CARD_CACHE_TAGS.CARD_BY_ID}:${cardId}`);
  }
  revalidatePath("/cards");
  revalidatePath("/cards/[id]", "page");
};

export const invalidateCardCaches = async (cardId?: string) => {
  revalidateCardCaches(cardId);
  const keysToInvalidate: string[] = CARD_ORDERINGS.map((order) => CARD_REDIS_KEYS.CARDS(order));
  if (cardId) {
    keysToInvalidate.push(CARD_REDIS_KEYS.CARD_BY_ID(cardId));
  }
  await redisCache.del(...keysToInvalidate);
};
