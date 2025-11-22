import { revalidatePath, revalidateTag } from "next/cache";

import redis from "@ziron/redis";

import { createLog } from "@/lib/utils";

const log = createLog("CompanyCache");

// Cache tags for company
export const COMPANY_CACHE_TAGS = {
  COMPANY: "company",
  COMPANIES: "companies",
  COMPANY_BY_ID: "company-by-id",
} as const;

// Cache durations
export const COMPANY_CACHE_DURATIONS = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 3600,
  VERY_LONG: 86400,
} as const;

// Redis keys
export const COMPANY_REDIS_KEYS = {
  COMPANIES: "companies:all",
  COMPANY_BY_ID: (id: string) => `company:${id}`,
} as const;

// Redis cache utility
export const redisCache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      log.info("Getting from cache", { key });
      const cached = await redis.get(key);
      if (cached) {
        log.info("Cache hit", { key });
        return JSON.parse(cached);
      }
      log.info("Cache miss", { key });
      return null;
    } catch (error) {
      log.error(`Redis get error for key ${key}`, { error });
      return null;
    }
  },
  async set<T>(key: string, data: T, ttl: number = COMPANY_CACHE_DURATIONS.MEDIUM): Promise<void> {
    try {
      log.info("Setting cache", { key, ttl });
      await redis.setex(key, ttl, JSON.stringify(data));
      log.info("Cache set", { key });
    } catch (error) {
      log.error(`Redis set error for key ${key}`, { error });
    }
  },
  async del(...keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        log.info("Deleting cache keys", { keys });
        await redis.del(...keys);
        log.info("Cache keys deleted", { keys });
      }
    } catch (error) {
      log.error("Redis deletion error", { error, keys });
    }
  },
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      log.info("Invalidating cache pattern", { pattern });
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        log.info("Cache pattern invalidated", { pattern, keys });
      } else {
        log.info("No keys matched for invalidation", { pattern });
      }
    } catch (error) {
      log.error(`Redis pattern invalidation error for ${pattern}`, { error });
    }
  },
};

// Invalidate and revalidate helpers
export const revalidateCompanyCaches = (companyId?: string) => {
  log.info("Revalidating company caches", { companyId });
  revalidateTag(COMPANY_CACHE_TAGS.COMPANY);
  revalidateTag(COMPANY_CACHE_TAGS.COMPANIES);
  if (companyId) {
    revalidateTag(`${COMPANY_CACHE_TAGS.COMPANY_BY_ID}:${companyId}`);
  }
  revalidatePath("/companies");
  revalidatePath("/companies/[id]", "page");
};

export const invalidateCompanyCaches = async (companyId?: string) => {
  log.info("Invalidating company caches", { companyId });
  revalidateCompanyCaches(companyId);
  const keysToInvalidate: string[] = [COMPANY_REDIS_KEYS.COMPANIES];
  if (companyId) {
    keysToInvalidate.push(COMPANY_REDIS_KEYS.COMPANY_BY_ID(companyId));
  }
  await redisCache.del(...keysToInvalidate);
};
