"use client";

import { createContext, useContext } from "react";

import { useEventTracking } from "@/hooks/use-analytics";

import { LinkProvider } from "./link-provider";

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
 * Client component that provides event tracking for a card
 *
 * Wraps card content and provides:
 * - Analytics context via `useAnalytics()` hook
 * - TrackableLink component via LinkProvider context
 *
 * **Important:** Page visits should be tracked separately in the server component
 * using the `trackPageVisit` server action.
 *
 * @example
 * ```tsx
 * // In a server component page
 * export default async function CardPage({ params }) {
 *   const card = await getCard(params.slug);
 *
 *   // Track page visit (server-side)
 *   trackPageVisit(card.id);
 *
 *   return (
 *     <CardTracker cardId={card.id}>
 *       <CardTemplate card={card} />
 *     </CardTracker>
 *   );
 * }
 *
 * // In a client component (inside CardTracker)
 * function CardContent() {
 *   const analytics = useAnalytics();
 *
 *   return (
 *     <button onClick={() => analytics.trackClick("custom_button")}>
 *       Click Me
 *     </button>
 *   );
 * }
 * ```
 */
export function CardTracker({ cardId, children }: CardTrackerProps) {
	const tracking = useEventTracking(cardId);

	return (
		<AnalyticsContext.Provider value={tracking}>
			<LinkProvider>{children}</LinkProvider>
		</AnalyticsContext.Provider>
	);
}
