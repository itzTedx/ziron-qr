"use client";

import { useLinkComponent } from "./link-provider";

interface TrackableLinkBoxProps {
	href: string;
	download?: boolean;
	phoneId?: string;
	emailId?: string;
	linkId?: string;
	className?: string;
	style?: React.CSSProperties;
	target?: string;
	children: React.ReactNode;
}

/**
 * Client component wrapper for LinkBox that uses TrackableLink from context
 * This allows templates (server components) to use tracking without being client components
 */
export function TrackableLinkBox({
	href,
	download,
	phoneId,
	emailId,
	linkId,
	className,
	style,
	target,
	children,
}: TrackableLinkBoxProps) {
	const LinkComponent = useLinkComponent();

	return (
		<LinkComponent
			className={className}
			download={download}
			emailId={emailId}
			href={href}
			linkId={linkId}
			phoneId={phoneId}
			style={style}
			target={target}
		>
			{children}
		</LinkComponent>
	);
}
