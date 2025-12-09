"use client";

import { useEffect, useRef } from "react";

import { EventNames, EventTypes, trackEvent, trackPageVisit } from "@/lib/analytics";

/**
 * Hook to track page visits automatically when a card is viewed
 */
export function usePageVisitTracking(cardId: string | undefined) {
	const hasTracked = useRef(false);

	useEffect(() => {
		if (cardId && !hasTracked.current) {
			hasTracked.current = true;
			// Track page visit after a short delay to ensure page is loaded
			const timeout = setTimeout(() => {
				trackPageVisit(cardId);
			}, 1000);

			return () => clearTimeout(timeout);
		}
	}, [cardId]);
}

/**
 * Hook to create event tracking functions
 */
export function useEventTracking(cardId: string | undefined) {
	const track = (eventType: string, eventName?: string, metadata?: Record<string, unknown>) => {
		if (cardId) {
			trackEvent(cardId, eventType, eventName, metadata);
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
