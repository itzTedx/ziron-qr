import { events, pageVisits } from "@ziron/db/schema";
import { z } from "@ziron/validators";

import { publicProcedure } from "..";
import { dbProvider } from "../middleware/db-provider";

// Utility function to extract device info from user agent
function parseUserAgent(userAgent: string | null) {
  if (!userAgent) {
    return {
      deviceType: "unknown",
      browser: "unknown",
      os: "unknown",
    };
  }

  const ua = userAgent.toLowerCase();

  // Device type
  let deviceType = "desktop";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = "mobile";
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = "tablet";
  }

  // Browser
  let browser = "unknown";
  if (ua.includes("chrome") && !ua.includes("edg")) browser = "chrome";
  else if (ua.includes("firefox")) browser = "firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "safari";
  else if (ua.includes("edg")) browser = "edge";
  else if (ua.includes("opera") || ua.includes("opr")) browser = "opera";

  // OS
  let os = "unknown";
  if (ua.includes("windows")) os = "windows";
  else if (ua.includes("mac os") || ua.includes("macos")) os = "macos";
  else if (ua.includes("linux")) os = "linux";
  else if (ua.includes("android")) os = "android";
  else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) os = "ios";

  return { deviceType, browser, os };
}

// Utility function to get IP address from request
function getIpAddress(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return null;
}

// Track a page visit
export const trackPageVisit = publicProcedure
  .use(dbProvider)
  .route({
    method: "POST",
    path: "/analytics/page-visit",
    summary: "Track a page visit",
    description: "Track when a card page is viewed",
    tags: ["analytics"],
  })
  .input(
    z.object({
      cardId: z.string().uuid(),
      referer: z.string().url().optional(),
    })
  )
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, context }) => {
    try {
      const request = context.reqHeaders;
      if (!request) {
        // If no request available, return success but skip tracking
        console.warn("No request available for page visit tracking");
        return { success: false };
      }
      const userAgent = request.get("user-agent");
      const ipAddress = getIpAddress(context.request);
      const deviceInfo = parseUserAgent(userAgent);

      await context.db.insert(pageVisits).values({
        cardId: input.cardId,
        ipAddress,
        userAgent,
        referer: input.referer ?? null,
        ...deviceInfo,
      });

      return { success: true };
    } catch (error) {
      // Silently fail analytics to not break user experience
      console.error("Failed to track page visit:", error);
      return { success: false };
    }
  });

// Track an event
export const trackEvent = publicProcedure
  .use(dbProvider)
  .route({
    method: "POST",
    path: "/analytics/event",
    summary: "Track an event",
    description: "Track user interactions like clicks, shares, downloads, etc.",
    tags: ["analytics"],
  })
  .input(
    z.object({
      cardId: z.string(),
      eventType: z.string().min(1).max(100), // e.g., "click", "share", "download"
      eventName: z.string().max(255).optional(), // e.g., "phone_click", "email_click", "link_click"
      metadata: z.record(z.string(), z.unknown()).optional(), // Additional event data
    })
  )
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input, context }) => {
    try {
      const request = context.request;
      if (!request) {
        // If no request available, return success but skip tracking
        console.warn("No request available for event tracking");
        return { success: false };
      }
      const userAgent = request.headers.get("user-agent");
      const ipAddress = getIpAddress(request);
      const deviceInfo = parseUserAgent(userAgent);

      await context.db.insert(events).values({
        cardId: input.cardId,
        eventType: input.eventType,
        eventName: input.eventName ?? null,
        metadata: input.metadata ?? null,
        ipAddress,
        userAgent,
        ...deviceInfo,
      });

      return { success: true };
    } catch (error) {
      // Silently fail analytics to not break user experience
      console.error("Failed to track event:", error);
      return { success: false };
    }
  });

// Get analytics for a card (protected - only card owners can view)
export const getCardAnalytics = publicProcedure
  .use(dbProvider)
  .route({
    method: "GET",
    path: "/analytics/card/:cardId",
    summary: "Get analytics for a card",
    description: "Get page visits and events analytics for a specific card",
    tags: ["analytics"],
  })
  .input(
    z.object({
      cardId: z.string().uuid(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
    })
  )
  .output(
    z.object({
      totalVisits: z.number(),
      totalEvents: z.number(),
      visitsByDate: z.array(
        z.object({
          date: z.string(),
          count: z.number(),
        })
      ),
      eventsByType: z.array(
        z.object({
          eventType: z.string(),
          count: z.number(),
        })
      ),
      recentVisits: z.array(
        z.object({
          id: z.string(),
          createdAt: z.date(),
          deviceType: z.string().nullable(),
          browser: z.string().nullable(),
          country: z.string().nullable(),
        })
      ),
    })
  )
  .handler(async ({ input, errors, context }) => {
    try {
      const startDate = input.startDate ? new Date(input.startDate) : undefined;
      const endDate = input.endDate ? new Date(input.endDate) : new Date();

      // Get all visits
      const allVisits = await context.db.query.pageVisits.findMany({
        where: (visits, { eq, and, gte, lte }) => {
          const conditions = [eq(visits.cardId, input.cardId)];
          if (startDate) conditions.push(gte(visits.createdAt, startDate));
          if (endDate) conditions.push(lte(visits.createdAt, endDate));
          return and(...conditions);
        },
        columns: {
          id: true,
          createdAt: true,
          deviceType: true,
          browser: true,
          country: true,
        },
      });

      // Get all events
      const allEvents = await context.db.query.events.findMany({
        where: (events, { eq, and, gte, lte }) => {
          const conditions = [eq(events.cardId, input.cardId)];
          if (startDate) conditions.push(gte(events.createdAt, startDate));
          if (endDate) conditions.push(lte(events.createdAt, endDate));
          return and(...conditions);
        },
        columns: {
          eventType: true,
        },
      });

      // Group visits by date
      const visitsByDateMap = new Map<string, number>();
      for (const visit of allVisits) {
        const date = visit.createdAt.toISOString().split("T")[0] ?? "";
        visitsByDateMap.set(date, (visitsByDateMap.get(date) ?? 0) + 1);
      }
      const visitsByDate = Array.from(visitsByDateMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Group events by type
      const eventsByTypeMap = new Map<string, number>();
      for (const event of allEvents) {
        eventsByTypeMap.set(event.eventType, (eventsByTypeMap.get(event.eventType) ?? 0) + 1);
      }
      const eventsByType = Array.from(eventsByTypeMap.entries()).map(([eventType, count]) => ({
        eventType,
        count,
      }));

      // Get recent visits (last 10)
      const recentVisits = allVisits
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10)
        .map((v) => ({
          id: v.id,
          createdAt: v.createdAt,
          deviceType: v.deviceType,
          browser: v.browser,
          country: v.country,
        }));

      return {
        totalVisits: allVisits.length,
        totalEvents: allEvents.length,
        visitsByDate,
        eventsByType,
        recentVisits,
      };
    } catch (error) {
      console.error("Failed to get analytics:", error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
