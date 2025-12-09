"use client";

import { createContext, useContext } from "react";

import { useEventTracking, usePageVisitTracking } from "@/hooks/use-analytics";

import { EventTracker } from "./event-tracker";

interface AnalyticsContextValue {
	track: (eventType: string, eventName?: string, metadata?: Record<string, unknown>) => void;
	trackClick: (eventName: string, metadata?: Record<string, unknown>) => void;
	trackShare: (platform: string, metadata?: Record<string, unknown>) => void;
	trackDownload: (type: string, metadata?: Record<string, unknown>) => void;
	trackPhoneClick: (phoneId?: string) => void;
	trackEmailClick: (emailId?: string) => void;
	trackLinkClick: (linkId: string, linkUrl: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function useAnalytics() {
	const context = useContext(AnalyticsContext);
	if (!context) {
		throw new Error("useAnalytics must be used within CardTracker");
	}
	return context;
}

interface CardTrackerProps {
	cardId?: string;
	children: React.ReactNode;
}

/**
 * Client component that tracks page visits and provides event tracking for a card
 */
export function CardTracker({ cardId, children }: CardTrackerProps) {
	usePageVisitTracking(cardId);
	const tracking = useEventTracking(cardId);

	return (
		<AnalyticsContext.Provider value={tracking}>
			<EventTracker>{children}</EventTracker>
		</AnalyticsContext.Provider>
	);
}
