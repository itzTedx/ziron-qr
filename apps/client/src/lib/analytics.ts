"use client";

import { client } from "./orpc/client";

/**
 * Track a page visit for a card
 */
export async function trackPageVisit(cardId: string) {
  try {
    const referer = typeof document !== "undefined" ? document.referrer : undefined;
    await client.analytics.trackPageVisit({
      cardId,
      referer: referer || undefined,
    });
  } catch (error) {
    // Silently fail analytics to not break user experience
    console.error("Failed to track page visit:", error);
  }
}

/**
 * Track an event (click, share, download, etc.)
 */
export async function trackEvent(
  cardId: string,
  eventType: string,
  eventName?: string,
  metadata?: Record<string, unknown>
) {
  try {
    await client.analytics.trackEvent({
      cardId,
      eventType,
      eventName,
      metadata,
    });
  } catch (error) {
    // Silently fail analytics to not break user experience
    console.error("Failed to track event:", error);
  }
}

/**
 * Common event types
 */
export const EventTypes = {
  CLICK: "click",
  SHARE: "share",
  DOWNLOAD: "download",
  PHONE_CALL: "phone_call",
  EMAIL: "email",
  LINK_CLICK: "link_click",
  QR_SCAN: "qr_scan",
} as const;

/**
 * Common event names
 */
export const EventNames = {
  PHONE_CLICK: "phone_click",
  EMAIL_CLICK: "email_click",
  LINK_CLICK: "link_click",
  SHARE_FACEBOOK: "share_facebook",
  SHARE_TWITTER: "share_twitter",
  SHARE_LINKEDIN: "share_linkedin",
  SHARE_WHATSAPP: "share_whatsapp",
  SHARE_COPY_LINK: "share_copy_link",
  DOWNLOAD_VCARD: "download_vcard",
  QR_CODE_SCAN: "qr_code_scan",
} as const;
