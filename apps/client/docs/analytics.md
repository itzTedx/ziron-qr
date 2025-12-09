# Analytics & Event Tracking Guide

This guide explains how to use the analytics system to track user interactions with digital business cards. The system uses Next.js Server Actions with the `after()` function pattern to ensure non-blocking, performant analytics tracking.

> **Note**: For information about conflicts, implementation details, and architectural decisions, see [Analytics Implementation Analysis](./analytics-conflicts.md).

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Page Visit Tracking](#page-visit-tracking)
- [Click Event Tracking](#click-event-tracking)
- [Programmatic Event Tracking](#programmatic-event-tracking)
- [Event Types & Names](#event-types--names)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The analytics system provides:

- **Automatic Page Visit Tracking**: Server-side tracking when cards are viewed
- **Automatic Click Tracking**: Phone, email, external links, and downloads
- **Programmatic Event Tracking**: Custom events via hooks and server actions
- **Non-blocking Performance**: Uses Next.js `after()` function to log after responses
- **Type-safe API**: Full TypeScript support with constants and interfaces

All tracking is designed to fail silently to ensure analytics never impact user experience.

## Architecture

The analytics system consists of several layers:

```
┌─────────────────────────────────────────────────────────┐
│ Server Components (Page Level)                          │
│ - trackPageVisit() server action                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ CardTracker (Client Component)                          │
│ - Provides analytics context                            │
│ - Provides TrackableLink via LinkProvider              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Tracking Components                                      │
│ - TrackableLink: Automatic link click tracking          │
│ - useAnalytics(): Programmatic event tracking           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Server Actions                                          │
│ - trackEvent(): Track custom events                     │
│ - Uses after() for non-blocking logging                 │
└─────────────────────────────────────────────────────────┘
```

## Page Visit Tracking

Page visits are tracked automatically in server components using server actions. This ensures tracking happens server-side and doesn't require client-side JavaScript.

### Basic Usage

```tsx
// apps/client/src/app/[slug]/page.tsx
import { trackPageVisit } from "@/actions/analytics";

export default async function DigitalCardPage({ params }) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);

  if (!card) return notFound();

  // Track page visit (non-blocking, runs after response is sent)
  trackPageVisit(card.id);

  return (
    <CardTracker cardId={card.id}>
      <CardTemplate card={card} />
    </CardTracker>
  );
}
```

### With Custom Referer

```tsx
// Track with custom referer information
trackPageVisit(card.id, "https://example.com/source");
```

### How It Works

1. `trackPageVisit()` is called in the server component
2. The page visit is recorded in the database
3. The `after()` function schedules logging to run after the response is sent
4. User receives the page immediately (non-blocking)
5. Analytics logging happens in the background

## Click Event Tracking

### Automatic Tracking with TrackableLink

The `TrackableLink` component automatically detects and tracks different types of link clicks. It must be used within a `CardTracker` component.

#### Phone Link Tracking

```tsx
import { TrackableLink } from "@/components/trackable-link";

<TrackableLink 
  href="tel:+1234567890" 
  phoneId="phone-123"
>
  Call Now
</TrackableLink>
```

#### Email Link Tracking

```tsx
<TrackableLink 
  href="mailto:user@example.com" 
  emailId="email-456"
>
  Send Email
</TrackableLink>
```

#### External Link Tracking

```tsx
<TrackableLink 
  href="https://example.com" 
  linkId="social-twitter"
>
  Visit Website
</TrackableLink>
```

#### Download Link Tracking

```tsx
<TrackableLink 
  href="/documents/resume.pdf" 
  download="resume.pdf"
>
  Download Resume
</TrackableLink>
```

### Link Detection Logic

`TrackableLink` automatically detects link types based on the `href`:

- **Phone Links**: `href.startsWith("tel:")` → Tracks as phone call
- **Email Links**: `href.startsWith("mailto:")` → Tracks as email click
- **External Links**: `href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")` → Tracks as link click
- **Downloads**: `download` attribute present → Tracks as download event

### Using TrackableLink in Templates

When building card templates, use `TrackableLink` instead of regular `Link` components:

```tsx
// In a template component
import { TrackableLink } from "@/components/trackable-link";

function CardTemplate({ card }) {
  return (
    <div>
      {card.phones?.map((phone) => (
        <TrackableLink
          key={phone.id}
          href={`tel:${phone.phone}`}
          phoneId={phone.id}
        >
          {phone.phone}
        </TrackableLink>
      ))}
      
      {card.emails?.map((email) => (
        <TrackableLink
          key={email.id}
          href={`mailto:${email.email}`}
          emailId={email.id}
        >
          {email.email}
        </TrackableLink>
      ))}
      
      {card.links?.map((link) => (
        <TrackableLink
          key={link.id}
          href={link.url}
          linkId={link.id}
        >
          {link.label}
        </TrackableLink>
      ))}
    </div>
  );
}
```

## Programmatic Event Tracking

For custom events that aren't link clicks, use the `useAnalytics()` hook or server actions directly.

### Using the useAnalytics Hook

The `useAnalytics()` hook provides methods for tracking various event types. It must be used within a `CardTracker` component.

```tsx
"use client";

import { useAnalytics } from "@/components/card-tracker";

function CustomButton() {
  const analytics = useAnalytics();

  const handleClick = () => {
    // Track a generic click event
    analytics.trackClick("header_button", {
      section: "navigation",
      timestamp: Date.now()
    });
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Available Tracking Methods

#### trackClick()

Track generic click events:

```tsx
analytics.trackClick("button_click", {
  buttonId: "save-contact",
  location: "header"
});
```

#### trackShare()

Track social media shares:

```tsx
analytics.trackShare("facebook", {
  postId: "123",
  shareType: "card"
});

analytics.trackShare("twitter", {
  tweetId: "456"
});
```

#### trackDownload()

Track file downloads:

```tsx
analytics.trackDownload("vcard", {
  format: "vcf",
  fileName: "contact.vcf"
});

analytics.trackDownload("pdf", {
  fileName: "resume.pdf",
  size: 1024000
});
```

#### trackPhoneClick()

Track phone number clicks:

```tsx
analytics.trackPhoneClick("phone-123");
```

#### trackEmailClick()

Track email address clicks:

```tsx
analytics.trackEmailClick("email-456");
```

#### trackLinkClick()

Track external link clicks:

```tsx
analytics.trackLinkClick("link-789", "https://example.com");
```

#### track()

Generic event tracking method:

```tsx
analytics.track("custom_event", "event_name", {
  customData: "value",
  metadata: { key: "value" }
});
```

### Using Server Actions Directly

For server-side tracking, use server actions directly:

```tsx
"use server";

import { trackEvent } from "@/actions/analytics";

export async function handleCustomAction(cardId: string) {
  // Perform your action
  await performAction();
  
  // Track the event
  await trackEvent(
    cardId,
    "custom_action",
    "action_completed",
    {
      actionType: "save",
      timestamp: Date.now()
    }
  );
}
```

## Event Types & Names

Use these constants to ensure consistency across your application:

### Event Types

```tsx
import { EventTypes } from "@/lib/analytics";

EventTypes.CLICK        // "click"
EventTypes.SHARE        // "share"
EventTypes.DOWNLOAD     // "download"
EventTypes.PHONE_CALL   // "phone_call"
EventTypes.EMAIL        // "email"
EventTypes.LINK_CLICK   // "link_click"
EventTypes.QR_SCAN      // "qr_scan"
```

### Event Names

```tsx
import { EventNames } from "@/lib/analytics";

EventNames.PHONE_CLICK      // "phone_click"
EventNames.EMAIL_CLICK      // "email_click"
EventNames.LINK_CLICK       // "link_click"
EventNames.SHARE_FACEBOOK   // "share_facebook"
EventNames.SHARE_TWITTER    // "share_twitter"
EventNames.SHARE_LINKEDIN   // "share_linkedin"
EventNames.SHARE_WHATSAPP   // "share_whatsapp"
EventNames.SHARE_COPY_LINK  // "share_copy_link"
EventNames.DOWNLOAD_VCARD   // "download_vcard"
EventNames.QR_CODE_SCAN     // "qr_code_scan"
```

### Usage Example

```tsx
import { EventTypes, EventNames } from "@/lib/analytics";

// Using constants ensures type safety and consistency
analytics.track(EventTypes.PHONE_CALL, EventNames.PHONE_CLICK, {
  phoneId: "phone-123"
});
```

## Best Practices

### 1. Always Use CardTracker

Wrap card content with `CardTracker` to enable analytics:

```tsx
// ✅ Good
<CardTracker cardId={card.id}>
  <CardContent />
</CardTracker>

// ❌ Bad - analytics won't work
<CardContent />
```

### 2. Track Page Visits in Server Components

Page visits should be tracked in server components, not client components:

```tsx
// ✅ Good - Server component
export default async function CardPage({ params }) {
  const card = await getCard(params.slug);
  trackPageVisit(card.id);
  return <CardTracker cardId={card.id}>...</CardTracker>;
}

// ❌ Bad - Client component
"use client";
export default function CardPage() {
  useEffect(() => {
    trackPageVisit(card.id); // Don't do this
  }, []);
}
```

### 3. Use TrackableLink for Links

Replace regular `Link` components with `TrackableLink` for automatic tracking:

```tsx
// ✅ Good
<TrackableLink href="tel:+1234567890" phoneId="phone-123">
  Call
</TrackableLink>

// ❌ Bad - No tracking
<Link href="tel:+1234567890">Call</Link>
```

### 4. Provide IDs for Better Analytics

Always provide `phoneId`, `emailId`, or `linkId` when using `TrackableLink`:

```tsx
// ✅ Good - Provides phoneId for tracking
<TrackableLink 
  href={`tel:${phone.phone}`} 
  phoneId={phone.id}
>
  {phone.phone}
</TrackableLink>

// ⚠️ Works but less useful - No ID provided
<TrackableLink href={`tel:${phone.phone}`}>
  {phone.phone}
</TrackableLink>
```

### 5. Use Constants for Event Types

Use `EventTypes` and `EventNames` constants instead of strings:

```tsx
// ✅ Good - Type-safe and consistent
import { EventTypes, EventNames } from "@/lib/analytics";
analytics.track(EventTypes.CLICK, EventNames.PHONE_CLICK);

// ❌ Bad - Prone to typos
analytics.track("click", "phone_click");
```

### 6. Add Metadata for Context

Include metadata to provide context about events:

```tsx
// ✅ Good - Rich metadata
analytics.trackClick("button_click", {
  buttonId: "save-contact",
  location: "header",
  cardId: card.id,
  timestamp: Date.now()
});

// ⚠️ Works but less informative
analytics.trackClick("button_click");
```

## Troubleshooting

### Analytics Not Working

**Problem**: Events aren't being tracked.

**Solutions**:
1. Ensure `CardTracker` wraps your content
2. Check that `cardId` is provided to `CardTracker`
3. Verify you're using `TrackableLink` for links
4. Check browser console for errors (in development mode)

### TrackableLink Not Tracking

**Problem**: `TrackableLink` clicks aren't being tracked.

**Solutions**:
1. Ensure `TrackableLink` is used within `CardTracker`
2. Verify the `href` matches expected patterns (`tel:`, `mailto:`, `http://`, etc.)
3. Check that analytics context is available (use `useAnalytics()` to test)

### Page Visits Not Tracked

**Problem**: Page visits aren't being recorded.

**Solutions**:
1. Ensure `trackPageVisit()` is called in a server component
2. Verify the `cardId` is valid
3. Check server logs for errors (in development mode)
4. Ensure `instrumentation.ts` is properly set up

### Development Logging

In development mode, analytics events are logged to the console:

```
[Analytics] Page visit tracked: {
  cardId: "uuid-here",
  referer: "https://example.com",
  userAgent: "Mozilla/5.0...",
  success: true,
  timestamp: "2024-01-01T00:00:00.000Z"
}

[Analytics] Event tracked: {
  cardId: "uuid-here",
  eventType: "click",
  eventName: "phone_click",
  metadata: { phoneId: "phone-123" },
  userAgent: "Mozilla/5.0...",
  success: true,
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

### Silent Failures

All analytics tracking is designed to fail silently to not impact user experience. If tracking fails:

1. The error is logged in development mode
2. The user experience continues normally
3. No error is thrown to the user
4. Check server logs for details

## API Reference

### Server Actions

#### `trackPageVisit(cardId: string, referer?: string)`

Tracks a page visit for a card.

- **Parameters**:
  - `cardId` (string): The UUID of the card being viewed
  - `referer` (string, optional): Referer URL (defaults to request header)
- **Returns**: `Promise<{ success: boolean }>`
- **Usage**: Server components only

#### `trackEvent(cardId: string, eventType: string, eventName?: string, metadata?: Record<string, unknown>)`

Tracks a custom event.

- **Parameters**:
  - `cardId` (string): The UUID of the card
  - `eventType` (string): Type of event (use `EventTypes` constants)
  - `eventName` (string, optional): Specific event name (use `EventNames` constants)
  - `metadata` (object, optional): Additional event data
- **Returns**: `Promise<{ success: boolean }>`
- **Usage**: Server actions or client components

### Components

#### `CardTracker`

Wraps card content and provides analytics context.

- **Props**:
  - `cardId` (string, optional): The UUID of the card
  - `children` (ReactNode): Card content
- **Usage**: Wrap card templates/components

#### `TrackableLink`

Link component with automatic click tracking.

- **Props**: Extends Next.js `Link` props plus:
  - `phoneId` (string, optional): ID for phone link tracking
  - `emailId` (string, optional): ID for email link tracking
  - `linkId` (string, optional): ID for external link tracking
- **Usage**: Replace `Link` components for automatic tracking

### Hooks

#### `useAnalytics()`

Returns analytics tracking methods.

- **Returns**: Object with tracking methods:
  - `track()`
  - `trackClick()`
  - `trackShare()`
  - `trackDownload()`
  - `trackPhoneClick()`
  - `trackEmailClick()`
  - `trackLinkClick()`
- **Usage**: Client components within `CardTracker`

## Examples

### Complete Card Page Example

```tsx
// apps/client/src/app/[slug]/page.tsx
import { trackPageVisit } from "@/actions/analytics";
import { CardTracker } from "@/components/card-tracker";
import CardTemplate from "@/templates/card-template";

export default async function DigitalCardPage({ params }) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);

  if (!card) return notFound();

  // Track page visit (server-side, non-blocking)
  trackPageVisit(card.id);

  return (
    <CardTracker cardId={card.id}>
      <CardTemplate card={card} />
    </CardTracker>
  );
}
```

### Custom Component with Tracking

```tsx
"use client";

import { useAnalytics } from "@/components/card-tracker";
import { EventTypes } from "@/lib/analytics";

function ShareButton({ cardId }: { cardId: string }) {
  const analytics = useAnalytics();

  const handleShare = async (platform: string) => {
    // Track the share event
    analytics.trackShare(platform, {
      cardId,
      timestamp: Date.now()
    });

    // Perform the share action
    await shareToPlatform(platform);
  };

  return (
    <div>
      <button onClick={() => handleShare("facebook")}>
        Share on Facebook
      </button>
      <button onClick={() => handleShare("twitter")}>
        Share on Twitter
      </button>
    </div>
  );
}
```

### Template with TrackableLink

```tsx
import { TrackableLink } from "@/components/trackable-link";

function ContactSection({ card }) {
  return (
    <section>
      <h2>Contact</h2>
      
      {card.phones?.map((phone) => (
        <TrackableLink
          key={phone.id}
          href={`tel:${phone.phone}`}
          phoneId={phone.id}
        >
          {phone.phone}
        </TrackableLink>
      ))}
      
      {card.emails?.map((email) => (
        <TrackableLink
          key={email.id}
          href={`mailto:${email.email}`}
          emailId={email.id}
        >
          {email.email}
        </TrackableLink>
      ))}
      
      {card.links?.map((link) => (
        <TrackableLink
          key={link.id}
          href={link.url}
          linkId={link.id}
        >
          {link.label}
        </TrackableLink>
      ))}
    </section>
  );
}
```

---

## Related Documentation

- [Main README](../../README.md#analytics-documentation) - Overview and quick examples
- [Analytics Implementation Analysis](./analytics-conflicts.md) - Conflict analysis, architecture details, and implementation status

