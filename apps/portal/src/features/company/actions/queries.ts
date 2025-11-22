import { db } from "@ziron/db/client";
import type { Company } from "@ziron/db/schema";

import { COMPANY_CACHE_DURATIONS, COMPANY_REDIS_KEYS, CompanyOrdering, redisCache } from "./cache";

export async function getCompanies(orderBy: CompanyOrdering = "name_asc") {
  try {
    const cacheKey = COMPANY_REDIS_KEYS.COMPANIES(orderBy);
    const cached = await redisCache.get<Company[]>(cacheKey);
    if (cached) {
      return cached;
    }

    let orderFn;
    switch (orderBy) {
      case "name_asc":
        orderFn = (companies: any, { asc }: { asc: any; desc: any }) => asc(companies.name);
        break;
      case "name_desc":
        orderFn = (companies: any, { desc }: { asc: any; desc: any }) => desc(companies.name);
        break;
      case "createdAt_asc":
        orderFn = (companies: any, { asc }: { asc: any; desc: any }) => asc(companies.createdAt);
        break;
      case "createdAt_desc":
        orderFn = (companies: any, { desc }: { asc: any; desc: any }) => desc(companies.createdAt);
        break;
      default:
        orderFn = (companies: any, { asc }: { asc: any; desc: any }) => asc(companies.name);
    }

    const data = await db.query.companies.findMany({
      where: (companies, { isNull }) => isNull(companies.deletedAt),
      with: {
        cards: true,
      },
      orderBy: orderFn,
    });

    await redisCache.set(cacheKey, data, COMPANY_CACHE_DURATIONS.LONG);

    return data;
  } catch (error) {
    console.log(error);
  }
}
