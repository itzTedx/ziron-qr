/**
 * Cookie-based storage implementation for Jotai's atomWithStorage
 * This allows Jotai atoms to persist state in cookies instead of localStorage
 */

interface CookieStorageOptions {
  maxAge?: number; // in seconds, defaults to 7 days
  path?: string; // defaults to "/"
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }
  return null;
}

function setCookie(name: string, value: string, options: CookieStorageOptions = {}): void {
  if (typeof document === "undefined") return;

  const {
    maxAge = 60 * 60 * 24 * 7, // 7 days default
    path = "/",
    sameSite = "lax",
    secure = false,
  } = options;

  // Encode value to handle special characters
  const encodedValue = encodeURIComponent(value);

  let cookieString = `${name}=${encodedValue}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`;

  if (secure) {
    cookieString += "; Secure";
  }

  document.cookie = cookieString;
}

function removeCookie(name: string, path = "/"): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=${path}; max-age=0`;
}

/**
 * Creates a cookie-based storage implementation compatible with Jotai's atomWithStorage
 * @param options - Cookie storage options
 * @returns A storage object that implements the Storage interface
 */
export function createCookieStorage(options: CookieStorageOptions = {}): Storage {
  return {
    getItem: (key: string): string | null => {
      const value = getCookie(key);
      if (value === null) return null;
      try {
        // Decode and return the value
        return decodeURIComponent(value);
      } catch {
        // If decoding fails, return the raw value
        return value;
      }
    },
    setItem: (key: string, value: string): void => {
      setCookie(key, value, options);
    },
    removeItem: (key: string): void => {
      removeCookie(key, options.path);
    },
    get length(): number {
      if (typeof document === "undefined") return 0;
      return document.cookie.split(";").filter((cookie) => cookie.trim() !== "").length;
    },
    clear(): void {
      if (typeof document === "undefined") return;
      // Note: We can't clear all cookies, only ones we know about
      // This is a limitation of the cookie API
    },
    key(index: number): string | null {
      if (typeof document === "undefined") return null;
      const cookies = document.cookie.split(";").map((c) => c.trim().split("=")[0]);
      return cookies[index] ?? null;
    },
  };
}

/**
 * Creates a JSON-aware cookie storage that automatically serializes/deserializes objects
 * Use this when storing complex objects (not just strings) in cookies
 * @param options - Cookie storage options
 * @returns A storage-like object that handles JSON serialization
 */
export function createJsonCookieStorage<T = unknown>(options: CookieStorageOptions = {}) {
  const baseStorage = createCookieStorage(options);

  return {
    getItem: (key: string): T | null => {
      const value = baseStorage.getItem(key);
      if (value === null) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        // If parsing fails, return null (invalid JSON)
        return null;
      }
    },
    setItem: (key: string, value: T): void => {
      const serialized = JSON.stringify(value);
      baseStorage.setItem(key, serialized);
    },
    removeItem: (key: string): void => {
      baseStorage.removeItem(key);
    },
  };
}

/**
 * Default cookie storage instance with standard options
 * Use this for most cases where you want cookie-based persistence
 */
export const cookieStorage = createCookieStorage({
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
  sameSite: "lax",
  secure: false,
});
