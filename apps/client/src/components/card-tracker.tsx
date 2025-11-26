"use client";

import { usePageVisitTracking } from "@/hooks/use-analytics";

interface CardTrackerProps {
  cardId: string;
  children: React.ReactNode;
}

/**
 * Client component that tracks page visits for a card
 */
export function CardTracker({ cardId, children }: CardTrackerProps) {
  usePageVisitTracking(cardId);
  return <>{children}</>;
}
