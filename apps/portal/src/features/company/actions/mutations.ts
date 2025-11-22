"use server";

import { eq } from "@ziron/db";
import { db } from "@ziron/db/client";
import { companies } from "@ziron/db/schema";
import { companySchema, z } from "@ziron/validators";

import { createLog } from "@/lib/utils";

import { COMPANY_CACHE_DURATIONS, COMPANY_REDIS_KEYS, invalidateCompanyCaches, redisCache } from "./cache";

const log = createLog("Company");

export async function upsertCompany(formData: unknown) {
  log.info("Received upsertCompany request", { formData });
  const { success, data, error } = companySchema.safeParse(formData);
  if (!success) {
    log.warn("Validation failed for upsertCompany", { error });
    return {
      success: false,
      error: "Invalid data",
      details: z.prettifyError(error),
    };
  }

  try {
    let company;
    if (data.id) {
      log.info("Attempting to update existing company", { id: data.id });
      company = await db
        .insert(companies)
        .values(data)
        .onConflictDoUpdate({
          target: companies.id,
          set: {
            name: data.name,
            phone: data.phone,
            website: data.website,
            address: data.address,
            logo: data.logo,
            updatedAt: new Date(),
          },
        })
        .returning();
      log.info("Company update operation complete", { company });
    } else {
      log.info("Attempting to create new company", { name: data.name });
      company = await db
        .insert(companies)
        .values({ ...data, createdAt: new Date(), updatedAt: new Date() })
        .returning();
      log.info("Company creation operation complete", { company });
    }

    if (!company || !company[0]) {
      log.error("Upsert failed, no company returned from database.", {
        company,
      });
      return {
        success: false,
        error: "Upsert failed, no company returned from database.",
      };
    }

    // Invalidate and update cache
    const cacheKey = COMPANY_REDIS_KEYS.COMPANY_BY_ID(company[0].id);
    log.info("Invalidating company caches", { companyId: company[0].id });
    await invalidateCompanyCaches(company[0].id);
    log.info("Setting company cache", {
      cacheKey,
      duration: COMPANY_CACHE_DURATIONS.MEDIUM,
    });
    await redisCache.set(cacheKey, company[0], COMPANY_CACHE_DURATIONS.MEDIUM);

    log.info("Upsert company successful", { company: company[0] });
    return {
      success: true,
      data: company[0],
    };
  } catch (error) {
    log.error("upsertCompany failed", { error });
    return {
      success: false,
      error: "Failed to upsert company",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function deleteCompany(id: string) {
  log.info("Received deleteCompany request", { id });
  if (!id) {
    log.warn("No id provided for deleteCompany");
    return {
      success: false,
      error: "No company id provided",
    };
  }

  try {
    const deleted = await db.update(companies).set({ deletedAt: new Date() }).where(eq(companies.id, id)).returning();
    log.info("Company soft delete operation complete", { deleted });

    if (!deleted || !deleted[0]) {
      log.error("Delete failed, no company deleted from database.", {
        deleted,
      });
      return {
        success: false,
        error: "Delete failed, no company deleted from database.",
      };
    }

    // Invalidate caches
    log.info("Invalidating company caches", { companyId: id });
    await invalidateCompanyCaches(id);

    log.info("Delete company successful", { company: deleted[0] });
    return {
      success: true,
      data: deleted[0],
    };
  } catch (error) {
    log.error("deleteCompany failed", { error });
    return {
      success: false,
      error: "Failed to delete company",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}
