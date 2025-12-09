"use client";

import { TrackableLink } from "./trackable-link";

interface TemplateWrapperProps {
	children: React.ReactNode;
}

/**
 * Client component wrapper that provides TrackableLink to templates
 * Templates can use this to get access to TrackableLink component
 */
export function TemplateWrapper({ children }: TemplateWrapperProps) {
	// This component provides TrackableLink via React context
	// Templates can access it through useLinkComponent hook
	return <>{children}</>;
}

// Export TrackableLink for direct use in templates if needed
export { TrackableLink };
