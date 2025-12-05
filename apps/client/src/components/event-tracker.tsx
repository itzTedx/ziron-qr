"use client";

import { useEffect, useRef } from "react";

import { useAnalytics } from "@/components/card-tracker";

interface EventTrackerProps {
  children: React.ReactNode;
}

/**
 * Client component that tracks events on interactive elements using event delegation
 */
export function EventTracker({ children }: EventTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Find the closest link element
      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Track phone clicks
      if (href.startsWith("tel:")) {
        const phoneId = link.getAttribute("data-phone-id");
        analytics.trackPhoneClick(phoneId || undefined);
        return;
      }

      // Track email clicks
      if (href.startsWith("mailto:")) {
        const emailId = link.getAttribute("data-email-id");
        analytics.trackEmailClick(emailId || undefined);
        return;
      }

      // Track link clicks (external links)
      if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
        const linkId = link.getAttribute("data-link-id") || link.getAttribute("id") || "unknown";
        analytics.trackLinkClick(linkId, href);
        return;
      }

      // Track downloads
      if (link.hasAttribute("download")) {
        const fileName = link.getAttribute("download") || link.textContent?.trim() || "file";
        analytics.trackDownload("attachment", { fileName, url: href });
        return;
      }
    };

    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [analytics]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {children}
    </div>
  );
}
