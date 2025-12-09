"use client";

import type { ComponentProps } from "react";
import { createContext, useContext } from "react";

import Link from "next/link";

import type { TrackableLinkProps } from "./trackable-link";
import { TrackableLink } from "./trackable-link";

interface LinkContextValue {
	LinkComponent: React.ComponentType<
		ComponentProps<typeof Link> & Partial<Pick<TrackableLinkProps, "phoneId" | "emailId" | "linkId">>
	>;
}

const LinkContext = createContext<LinkContextValue | null>(null);

export function useLinkComponent() {
	const context = useContext(LinkContext);
	return context?.LinkComponent || Link;
}

interface LinkProviderProps {
	children: React.ReactNode;
}

/**
 * Provides TrackableLink component via context for templates to use
 * This allows server components (templates) to use client-side tracking
 */
export function LinkProvider({ children }: LinkProviderProps) {
	return <LinkContext.Provider value={{ LinkComponent: TrackableLink }}>{children}</LinkContext.Provider>;
}
