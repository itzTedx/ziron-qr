"use client";

import { client } from "./orpc/client";

/**
 * Utility to log analytics after an operation completes
 * Uses the "after" pattern to ensure logging happens post-operation
 */
function after<T>(operation: () => Promise<T>, logFn: (result: T) => Promise<void>): Promise<T> {
	return operation().then(async (result) => {
		// Log after the operation completes (non-blocking)
		logFn(result).catch((error) => {
			// Silently fail logging to not break user experience
			if (process.env.NODE_ENV === "development") {
				console.error("[Analytics] Failed to log after operation:", error);
			}
		});
		return result;
	});
}

/**
 * Track a page visit for a card
 * Uses "after" pattern to log analytics after tracking completes
 */
export async function trackPageVisit(cardId: string) {
	try {
		const referer = typeof document !== "undefined" ? document.referrer : undefined;
		const result = await client.analytics.trackPageVisit({
			cardId,
			referer: referer || undefined,
		});

		// Log after tracking completes (non-blocking)
		after(
			async () => result,
			async (result) => {
				if (process.env.NODE_ENV === "development") {
					console.log("[Analytics] Page visit tracked:", {
						cardId,
						referer,
						success: result.success,
						timestamp: new Date().toISOString(),
					});
				}
			}
		).catch(() => {
			// Silently fail logging
		});
	} catch (error) {
		// Silently fail analytics to not break user experience
		if (process.env.NODE_ENV === "development") {
			console.error("[Analytics] Failed to track page visit:", error);
		}
	}
}

/**
 * Track an event (click, share, download, etc.)
 * Uses "after" pattern to log analytics after tracking completes
 */
export async function trackEvent(
	cardId: string,
	eventType: string,
	eventName?: string,
	metadata?: Record<string, unknown>
) {
	try {
		const result = await client.analytics.trackEvent({
			cardId,
			eventType,
			eventName,
			metadata,
		});

		// Log after tracking completes (non-blocking)
		after(
			async () => result,
			async (result) => {
				if (process.env.NODE_ENV === "development") {
					console.log("[Analytics] Event tracked:", {
						cardId,
						eventType,
						eventName,
						metadata,
						success: result.success,
						timestamp: new Date().toISOString(),
					});
				}
			}
		).catch(() => {
			// Silently fail logging
		});
	} catch (error) {
		// Silently fail analytics to not break user experience
		if (process.env.NODE_ENV === "development") {
			console.error("[Analytics] Failed to track event:", error);
		}
	}
}

/**
 * Common event types for analytics tracking
 *
 * Use these constants when tracking events to ensure consistency:
 *
 * @example
 * ```tsx
 * import { EventTypes } from "@/lib/analytics";
 *
 * analytics.track(EventTypes.CLICK, "button_click");
 * analytics.track(EventTypes.SHARE, "share_facebook");
 * ```
 */
export const EventTypes = {
	CLICK: "click",
	SHARE: "share",
	DOWNLOAD: "download",
	PHONE_CALL: "phone_call",
	EMAIL: "email",
	LINK_CLICK: "link_click",
	QR_SCAN: "qr_scan",
} as const;

/**
 * Common event names for analytics tracking
 *
 * Use these constants for standardized event names:
 *
 * @example
 * ```tsx
 * import { EventNames } from "@/lib/analytics";
 *
 * analytics.track(EventTypes.PHONE_CALL, EventNames.PHONE_CLICK);
 * analytics.track(EventTypes.EMAIL, EventNames.EMAIL_CLICK);
 * ```
 */
export const EventNames = {
	PHONE_CLICK: "phone_click",
	EMAIL_CLICK: "email_click",
	LINK_CLICK: "link_click",
	SHARE_FACEBOOK: "share_facebook",
	SHARE_TWITTER: "share_twitter",
	SHARE_LINKEDIN: "share_linkedin",
	SHARE_WHATSAPP: "share_whatsapp",
	SHARE_COPY_LINK: "share_copy_link",
	DOWNLOAD_VCARD: "download_vcard",
	QR_CODE_SCAN: "qr_code_scan",
} as const;
