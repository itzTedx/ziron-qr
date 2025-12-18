"use server";

import { headers } from "next/headers";
import { after } from "next/server";

import { client } from "@/lib/orpc/client";

/**
 * Track a page visit for a card
 *
 * Uses Next.js Server Action with the `after()` function to log analytics
 * after the response is sent, ensuring non-blocking performance.
 *
 * @param cardId - The UUID of the card being viewed
 * @param referer - Optional referer URL (defaults to request header if not provided)
 * @returns Promise resolving to { success: boolean }
 *
 * @example
 * ```tsx
 * // In a server component
 * export default async function CardPage({ params }) {
 *   const card = await getCard(params.slug);
 *   trackPageVisit(card.id); // Non-blocking, runs after response
 *   return <CardContent card={card} />;
 * }
 * ```
 */
export async function trackPageVisit(cardId: string, referer?: string) {
	try {
		// Track the page visit
		const result = await client.analytics.trackPageVisit({
			cardId,
			referer: referer || undefined,
		});

		// Log analytics after response is sent (non-blocking)
		after(async () => {
			try {
				const headersList = await headers();
				const userAgent = headersList.get("user-agent") || "unknown";
				const refererHeader = headersList.get("referer") || referer || "direct";

				if (process.env.NODE_ENV === "development") {
					console.log("[Analytics] Page visit tracked:", {
						cardId,
						referer: refererHeader,
						userAgent,
						success: result.success,
						timestamp: new Date().toISOString(),
					});
				}
			} catch (error) {
				// Silently fail logging to not break user experience
				if (process.env.NODE_ENV === "development") {
					console.error("[Analytics] Failed to log page visit:", error);
				}
			}
		});

		return result;
	} catch (error) {
		// Silently fail analytics to not break user experience
		if (process.env.NODE_ENV === "development") {
			console.error("[Analytics] Failed to track page visit:", error);
		}
		return { success: false };
	}
}

/**
 * Track an event (click, share, download, etc.)
 *
 * Uses Next.js Server Action with the `after()` function to log analytics
 * after the response is sent, ensuring non-blocking performance.
 *
 * @param cardId - The UUID of the card associated with the event
 * @param eventType - Type of event (e.g., "click", "share", "download")
 * @param eventName - Optional specific event name (e.g., "phone_click", "share_facebook")
 * @param metadata - Optional additional event data as key-value pairs
 * @returns Promise resolving to { success: boolean }
 *
 * @example
 * ```tsx
 * // In a server action
 * "use server";
 * import { trackEvent } from "@/actions/analytics";
 *
 * export async function handleShare(cardId: string, platform: string) {
 *   await trackEvent(cardId, "share", `share_${platform}`, {
 *     platform,
 *     timestamp: Date.now()
 *   });
 * }
 * ```
 */
export async function trackEvent(
	cardId: string,
	eventType: string,
	eventName?: string,
	metadata?: Record<string, unknown>
) {
	try {
		// Track the event
		const result = await client.analytics.trackEvent({
			cardId,
			eventType,
			eventName,
			metadata,
		});

		const headersList = await headers();
		const userAgent = headersList.get("user-agent") || "unknown";

		// Log analytics after response is sent (non-blocking)
		after(async () => {
			try {
				if (process.env.NODE_ENV === "development") {
					console.log("[Analytics] Event tracked:", {
						cardId,
						eventType,
						eventName,
						metadata,
						userAgent,
						success: result.success,
						timestamp: new Date().toISOString(),
					});
				}
			} catch (error) {
				// Silently fail logging to not break user experience
				if (process.env.NODE_ENV === "development") {
					console.error("[Analytics] Failed to log event:", error);
				}
			}
		});

		return result;
	} catch (error) {
		// Silently fail analytics to not break user experience
		if (process.env.NODE_ENV === "development") {
			console.error("[Analytics] Failed to track event:", error);
		}
		return { success: false };
	}
}
