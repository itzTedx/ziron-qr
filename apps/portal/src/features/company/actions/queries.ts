import type { Company } from "@ziron/db/schema";
import { db } from "@ziron/db/client";

import {
  COMPANY_CACHE_DURATIONS,
  COMPANY_REDIS_KEYS,
  redisCache,
} from "./cache";

export async function getCompanies() {
  try {
    // Try Redis first
    const cached = await redisCache.get<Company[]>(
      COMPANY_REDIS_KEYS.COMPANIES,
    );
    if (cached) {
      return cached;
    }

    // Fallback to database
    const data = await db.query.companies.findMany();

    // Cache the result
    await redisCache.set(
      COMPANY_REDIS_KEYS.COMPANIES,
      data,
      COMPANY_CACHE_DURATIONS.LONG,
    );

    return data;
  } catch (error) {
    console.log(error);
  }
}
