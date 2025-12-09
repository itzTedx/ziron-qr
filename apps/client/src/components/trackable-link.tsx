"use client";

import type { ComponentProps } from "react";

import Link from "next/link";

import { useAnalytics } from "@/components/card-tracker";

export interface TrackableLinkProps extends Omit<ComponentProps<typeof Link>, "onClick"> {
	phoneId?: string;
	emailId?: string;
	linkId?: string;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Link component that automatically tracks analytics events
 *
 * Automatically detects and tracks different types of link clicks:
 * - Phone links (`tel:`) - tracks with phoneId
 * - Email links (`mailto:`) - tracks with emailId
 * - External links (`http://`, `https://`, `//`) - tracks with linkId
 * - Download links (with `download` attribute) - tracks as download event
 *
 * Must be used within a `CardTracker` component to access analytics context.
 *
 * @example
 * ```tsx
 * // Phone link
 * <TrackableLink href="tel:+1234567890" phoneId="phone-123">
 *   Call Now
 * </TrackableLink>
 *
 * // Email link
 * <TrackableLink href="mailto:user@example.com" emailId="email-456">
 *   Send Email
 * </TrackableLink>
 *
 * // External link
 * <TrackableLink href="https://example.com" linkId="social-twitter">
 *   Visit Website
 * </TrackableLink>
 *
 * // Download link
 * <TrackableLink href="/file.pdf" download="document.pdf">
 *   Download PDF
 * </TrackableLink>
 * ```
 */
export function TrackableLink({ phoneId, emailId, linkId, href, onClick, download, ...props }: TrackableLinkProps) {
	const analytics = useAnalytics();

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (href) {
			const hrefStr =
				typeof href === "string" ? href : (href.pathname || "") + (href.search || "") + (href.hash || "");

			// Track phone clicks
			if (hrefStr.startsWith("tel:")) {
				analytics.trackPhoneClick(phoneId);
			}
			// Track email clicks
			else if (hrefStr.startsWith("mailto:")) {
				analytics.trackEmailClick(emailId);
			}
			// Track external link clicks
			else if (hrefStr.startsWith("http://") || hrefStr.startsWith("https://") || hrefStr.startsWith("//")) {
				const id = linkId || props.id || "unknown";
				analytics.trackLinkClick(id, hrefStr);
			}
			// Track downloads
			else if (download) {
				const fileName = typeof download === "string" ? download : hrefStr.split("/").pop() || "file";
				analytics.trackDownload("attachment", { fileName, url: hrefStr });
			}
		}

		onClick?.(e);
	};

	return <Link {...props} download={download} href={href} onClick={handleClick} />;
}
