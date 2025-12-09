# Analytics Implementation Analysis

## Current State

### ✅ Working Correctly

1. **Page Visit Tracking** (`apps/client/src/app/[slug]/page.tsx`)
   - Uses `trackPageVisit()` server action
   - Runs in server component with proper `cardId` access
   - Uses `after()` function for non-blocking logging
   - ✅ **No conflicts**

2. **Event Tracking via Server Actions** (`apps/client/src/actions/analytics.ts`)
   - `trackEvent()` server action works correctly
   - Uses `after()` function for non-blocking logging
   - ✅ **No conflicts**

3. **Client-Side Event Tracking** (`apps/client/src/hooks/use-analytics.ts`)
   - `useAnalytics()` hook works correctly
   - Calls server actions for tracking
   - ✅ **No conflicts**

### ⚠️ Issues Found

1. **Proxy Implementation** (`apps/client/src/proxy.ts`)
   - **Status**: ✅ **FIXED** - Removed redundant page visit logging
   - **Previous Issue**: Was attempting to log page visits but:
     - Only logged to console (didn't track to database)
     - Ran for ALL routes (not just card pages)
     - Didn't have access to `cardId` (only had slug)
     - Would conflict with proper tracking in page component
   - **Resolution**: Removed page visit logging from proxy. Page visits are now only tracked via server actions in page components.

2. **Templates Not Using Tracking** (`packages/ui/src/templates/*.tsx`)
   - **Status**: ⚠️ **PARTIALLY IMPLEMENTED**
   - **Issue**: Templates use regular `Link` components instead of `TrackableLink`
   - **Current State**:
     - `modern-template.tsx`: LinkBox accepts tracking props but uses regular `Link` by default
     - `card-template.tsx`: Uses regular `Link` components (no tracking)
     - `default-template.tsx`: Uses regular `Link` components (no tracking)
   - **Impact**: Phone, email, and external link clicks are NOT automatically tracked in templates
   - **Solution Needed**: Templates need to use `TrackableLinkBox` or `LinkBox` needs to use `TrackableLink` from context

## Architecture Flow

```
Request Flow:
1. Proxy (proxy.ts) - ✅ No longer tracks (fixed)
   └─> Just passes through requests

2. Page Component ([slug]/page.tsx) - ✅ Tracks page visits
   └─> Calls trackPageVisit(card.id) server action
   └─> Wraps content in <CardTracker>

3. CardTracker - ✅ Provides analytics context
   └─> Provides useAnalytics() hook
   └─> Provides TrackableLink via LinkProvider

4. Templates - ⚠️ Not using tracking
   └─> Use regular Link components
   └─> Should use TrackableLinkBox or TrackableLink
```

## Conflict Analysis

### Proxy vs Page-Level Tracking

**Before Fix:**
- ❌ Proxy attempted to log page visits (console only)
- ❌ Page component tracks page visits (database)
- ⚠️ Potential confusion but no actual conflict (proxy didn't write to DB)

**After Fix:**
- ✅ Proxy no longer tracks (removed)
- ✅ Page component tracks page visits (database)
- ✅ **No conflicts**

### Template Tracking

**Current State:**
- Templates are server components in `packages/ui` package
- They use regular `Link` components
- `TrackableLink` is a client component in `apps/client` package
- Templates can't directly import from `apps/client`

**Options:**
1. **Use TrackableLinkBox** (client component) - Templates can use client components
2. **Pass TrackableLink as prop** - Requires prop drilling
3. **Create shared component** - Move TrackableLinkBox to `packages/ui`
4. **Use LinkBox with context** - Make LinkBox a client component that uses context

## Recommendations

### Immediate Actions

1. ✅ **Proxy Fixed** - Removed redundant logging
2. ⚠️ **Templates Need Update** - Replace `Link` with `TrackableLinkBox` where tracking is needed

### Template Updates Needed

Update templates to use `TrackableLinkBox` for links that should be tracked:

```tsx
// Instead of:
<Link href={`tel:${phone.phone}`}>{phone.phone}</Link>

// Use:
<TrackableLinkBox 
  href={`tel:${phone.phone}`} 
  phoneId={phone.id}
>
  {phone.phone}
</TrackableLinkBox>
```

However, since `TrackableLinkBox` is in `apps/client` and templates are in `packages/ui`, we need to either:
- Export `TrackableLinkBox` from a shared location
- Create a wrapper in `packages/ui` that uses `TrackableLinkBox`
- Make `LinkBox` use `TrackableLink` from context (requires making it a client component)

## Summary

| Component | Status | Tracking | Notes |
|-----------|--------|----------|-------|
| Proxy | ✅ Fixed | None | Removed redundant logging |
| Page Component | ✅ Working | Page Visits | Uses server actions |
| CardTracker | ✅ Working | Context Provider | Provides analytics context |
| TrackableLink | ✅ Working | Link Clicks | Works when used |
| Templates | ⚠️ Needs Update | None | Using regular Link components |
| Server Actions | ✅ Working | Events | trackPageVisit, trackEvent |

## Next Steps

1. ✅ Proxy conflict resolved
2. ⚠️ Update templates to use tracking (requires architectural decision on how to share TrackableLinkBox between packages)

