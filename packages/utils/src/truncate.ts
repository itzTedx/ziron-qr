/**
 * Options for `truncate`.
 */
export type TruncateOptions = {
  /**
   * The string appended to truncated text (default: '…').
   * Note: the final returned string will never be longer than `maxLength`.
   */
  ellipsis?: string;

  /**
   * When true, prefer to cut at the last occurrence of `separator` before the limit,
   * so words aren't split. If no separator is found before the limit, it will
   * fall back to a hard cutoff.
   *
   * Default: true
   */
  preserveWords?: boolean;

  /**
   * Character (or substring) used as a word separator when `preserveWords` is true.
   * Default: ' ' (space)
   */
  separator?: string;

  /**
   * When true, truncation will only occur on mobile devices (detected via CSS media query).
   * If `mobileOnly` is true and the viewport is not mobile, the original string is returned.
   * Mobile detection uses `window.matchMedia` with the `mobileBreakpoint` value.
   * Default: false
   */
  mobileOnly?: boolean;

  /**
   * CSS breakpoint (in pixels) used to detect mobile devices when `mobileOnly` is true.
   * Uses `(max-width: ${mobileBreakpoint}px)` media query.
   * Default: 768px
   */
  mobileBreakpoint?: number;
};

/**
 * Truncates a string to a maximum length.
 *
 * Behavior:
 * - If `mobileOnly` is true and `isMobile` is false, the original string is returned without truncation.
 * - If the input length is <= `maxLength`, the original string is returned.
 * - If truncation is required, `ellipsis` (default '…') is appended and the result's total length
 *   will be <= `maxLength`.
 * - If `preserveWords` is true (default), the function tries to cut at the last `separator`
 *   before the available characters for content (i.e. `maxLength - ellipsis.length`). If no
 *   separator is found, it will perform a hard cut.
 *
 * Examples:
 * ```ts
 * truncate("Hello world", 11)           // "Hello world" (no truncation)
 * truncate("Hello wonderful world", 11) // "Hello…"
 * truncate("Hello wonderful world", 11, { preserveWords: false }) // "Hello won…"
 * truncate("LongTextWithoutSpaces", 10) // "LongTextW…" (falls back to hard cut)
 * truncate("Hello wonderful world", 11, { mobileOnly: true }) // Uses CSS media query to detect mobile
 * truncate("Hello wonderful world", 11, { mobileOnly: true, mobileBreakpoint: 640 }) // Custom breakpoint
 * ```
 *
 * @param input - The string to truncate.
 * @param maxLength - Maximum allowed length of the returned string (must be >= 0).
 * @param opts - Optional settings (ellipsis, preserveWords, separator, mobileOnly, mobileBreakpoint).
 * @returns The truncated string (or original when no truncation needed or when mobileOnly is true and not on mobile).
 * @throws {TypeError} If `input` is not a string or `maxLength` is not a finite non-negative integer.
 */
/**
 * Detects if the current viewport is mobile using CSS media query.
 * @param breakpoint - The breakpoint in pixels (default: 768)
 * @returns true if viewport width is <= breakpoint, false otherwise. Returns false in SSR environments.
 */
function detectMobile(breakpoint = 768): boolean {
  // SSR safety: if window is not available, assume not mobile
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  try {
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  } catch {
    // Fallback if matchMedia fails
    return false;
  }
}

export function truncate(input: string, maxLength: number, opts?: TruncateOptions): string {
  // Validate inputs
  if (typeof input !== "string") {
    throw new TypeError("truncate: input must be a string");
  }
  if (!Number.isFinite(maxLength) || maxLength < 0 || !Number.isInteger(maxLength)) {
    throw new TypeError("truncate: maxLength must be a non-negative integer");
  }

  const {
    ellipsis = "…",
    preserveWords = true,
    separator = " ",
    mobileOnly = false,
    mobileBreakpoint = 768,
  } = opts ?? {};

  // If mobileOnly is true, check if we're on mobile using CSS detection
  if (mobileOnly && !detectMobile(mobileBreakpoint)) {
    return input;
  }

  // If maxLength is 0, return empty string (can't add ellipsis)
  if (maxLength === 0) return "";

  // If input already fits, return as-is
  if (input.length <= maxLength) return input;

  // If ellipsis is longer than maxLength, return a trimmed ellipsis (or empty)
  if (ellipsis.length >= maxLength) {
    return ellipsis.slice(0, maxLength);
  }

  const contentMax = maxLength - ellipsis.length;

  if (!preserveWords) {
    // Hard cut
    return input.slice(0, contentMax) + ellipsis;
  }

  // Try to find the last separator before or at contentMax
  const candidate = input.slice(0, contentMax);
  const lastSep = candidate.lastIndexOf(separator);

  if (lastSep > 0) {
    // cut at separator (trim trailing separators to avoid awkward endings)
    const trimmed = candidate.slice(0, lastSep).replace(new RegExp(`${separator}+$`), "");
    return trimmed + ellipsis;
  }

  // No separator found — fallback to hard cut
  return candidate + ellipsis;
}

export default truncate;
