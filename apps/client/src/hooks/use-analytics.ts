"use client";

import { trackEvent } from "@/actions/analytics";
import { EventNames, EventTypes } from "@/lib/analytics";

/**
 * Hook to create event tracking functions using server actions
 *
 * Returns an object with methods to track various types of events.
 * All tracking uses server actions with the `after()` function for non-blocking logging.
 *
 * **Must be used within a `CardTracker` component.**
 *
 * @param cardId - The UUID of the card to track events for
 * @returns Object with tracking methods:
 *   - `track()` - Generic event tracking
 *   - `trackClick()` - Track click events
 *   - `trackShare()` - Track social share events
 *   - `trackDownload()` - Track download events
 *   - `trackPhoneClick()` - Track phone number clicks
 *   - `trackEmailClick()` - Track email address clicks
 *   - `trackLinkClick()` - Track external link clicks
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const analytics = useAnalytics();
 *
 *   return (
 *     <button onClick={() => analytics.trackClick("header_button")}>
 *       Click Me
 *     </button>
 *   );
 * }
 * ```
 */
export function useEventTracking(cardId: string | undefined) {
	const track = (eventType: string, eventName?: string, metadata?: Record<string, unknown>) => {
		if (cardId) {
			// Call server action - it uses "after" function internally for logging
			trackEvent(cardId, eventType, eventName, metadata).catch(() => {
				// Silently fail analytics to not break user experience
			});
		}
	};

	return {
		track,
		trackClick: (eventName: string, metadata?: Record<string, unknown>) => {
			track(EventTypes.CLICK, eventName, metadata);
		},
		trackShare: (platform: string, metadata?: Record<string, unknown>) => {
			track(EventTypes.SHARE, `share_${platform}`, metadata);
		},
		trackDownload: (type: string, metadata?: Record<string, unknown>) => {
			track(EventTypes.DOWNLOAD, `download_${type}`, metadata);
		},
		trackPhoneClick: (phoneId?: string) => {
			track(EventTypes.PHONE_CALL, EventNames.PHONE_CLICK, phoneId ? { phoneId } : undefined);
		},
		trackEmailClick: (emailId?: string) => {
			track(EventTypes.EMAIL, EventNames.EMAIL_CLICK, emailId ? { emailId } : undefined);
		},
		trackLinkClick: (linkId: string, linkUrl: string) => {
			track(EventTypes.LINK_CLICK, EventNames.LINK_CLICK, { linkId, linkUrl });
		},
	};
}

/**
 * Hook to track page visits automatically when a card is viewed
 * NOTE: Page visits are now tracked in the server component using server actions
 * This hook is kept for backward compatibility but is no longer needed
 * @deprecated Use server action trackPageVisit in page component instead
 * @param _cardId - Card ID (unused, kept for API compatibility)
 */
export function usePageVisitTracking(_cardId: string | undefined) {
	// This hook is deprecated - page visits are now tracked in server components
	// Kept for backward compatibility
}
