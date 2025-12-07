import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useId, useState } from "react";

import { stableSort } from "@ziron/utils";

/**
 * Configuration object for a keyboard shortcut listener.
 * Used internally by the hook to manage registered shortcuts.
 */
type KeyboardShortcutListener = {
  id: string;
  key: string | string[];
  enabled?: boolean;
  priority?: number;
  modal?: boolean;
  sheet?: boolean;
};

export const KeyboardShortcutContext = createContext<{
  listeners: KeyboardShortcutListener[];
  setListeners: Dispatch<SetStateAction<KeyboardShortcutListener[]>>;
}>({
  listeners: [] as KeyboardShortcutListener[],
  setListeners: () => {},
});

/**
 * Provider component that manages keyboard shortcut listeners across the application.
 * Must wrap your app (or the portion where shortcuts should work) to enable keyboard shortcuts.
 *
 * @param children - React children to render within the provider context
 *
 * @example
 * // In your app root or layout
 * function App() {
 *   return (
 *     <KeyboardShortcutProvider>
 *       <YourApp />
 *     </KeyboardShortcutProvider>
 *   );
 * }
 */
export function KeyboardShortcutProvider({ children }: { children: React.ReactNode }) {
  const [listeners, setListeners] = useState<KeyboardShortcutListener[]>([]);

  return (
    <KeyboardShortcutContext.Provider value={{ listeners, setListeners }}>{children}</KeyboardShortcutContext.Provider>
  );
}

const OVERLAY_QUERY = `
  [data-slot="dialog-overlay"],
  [data-slot="dialog-content"][data-state="open"],
  [data-slot="dialog"][data-state="open"],
  [data-slot="drawer-overlay"],
  [data-slot="drawer-content"][data-state="open"],
  [data-slot="drawer"][data-state="open"],
  [data-slot="sheet-overlay"],
  [data-slot="sheet-content"][data-state="open"],
  [role="dialog"]:not([aria-hidden="true"]),
  [role="alertdialog"]:not([aria-hidden="true"])
`;

/**
 * Hook for registering keyboard shortcuts with support for priority, modal handling, and conditional enabling.
 *
 * @param key - The keyboard shortcut to listen for. Can be:
 *   - A single string: `"Escape"`, `"ctrl+s"`, `"meta+k"`, `"ctrl+shift+p"`
 *   - An array of strings: `["Escape", "Enter"]` to match multiple keys
 *   - Modifier keys: Use `ctrl`, `meta` (Cmd on Mac), `alt`, `shift` prefixes
 *   - Examples: `"ctrl+s"`, `"meta+k"`, `"Escape"`, `["Escape", "Enter"]`
 *
 * @param callback - Function to execute when the shortcut is triggered.
 *   Receives the KeyboardEvent as parameter.
 *   Example: `(e) => { console.log("Shortcut pressed", e); }`
 *
 * @param options - Optional configuration object:
 *   - `enabled?: boolean` - Whether the shortcut is active. Defaults to `true`.
 *     Set to `false` to temporarily disable without unregistering.
 *     Example: `{ enabled: isEditing }` - only active when not editing
 *
 *   - `priority?: number` - Priority level for handling conflicts when multiple
 *     listeners match the same key. Higher numbers win. Defaults to `0`.
 *     Example: `{ priority: 10 }` - this listener takes precedence over others
 *
 *   - `modal?: boolean` - Allow the shortcut to work when a modal/dialog is open.
 *     Defaults to `false`. When `true`, the shortcut will trigger even if a modal
 *     overlay is present (useful for modal-specific shortcuts like closing modals).
 *     Example: `{ modal: true }` - works inside modals
 *
 *   - `sheet?: boolean` - Allow the shortcut to work when a sheet/drawer is open.
 *     Defaults to `false`. When `true`, the shortcut will trigger even if a sheet
 *     overlay is present (useful for sheet-specific shortcuts).
 *     Example: `{ sheet: true }` - works inside sheets
 *
 * @example
 * // Basic usage - simple Escape key
 * useKeyboardShortcut("Escape", () => {
 *   console.log("Escape pressed");
 * });
 *
 * @example
 * // Save shortcut with Ctrl+S (or Cmd+S on Mac)
 * useKeyboardShortcut("ctrl+s", (e) => {
 *   e.preventDefault();
 *   handleSave();
 * });
 *
 * @example
 * // Multiple keys - either Escape or Enter
 * useKeyboardShortcut(["Escape", "Enter"], () => {
 *   handleAction();
 * });
 *
 * @example
 * // Conditional enabling
 * useKeyboardShortcut("ctrl+s", handleSave, {
 *   enabled: !isLoading
 * });
 *
 * @example
 * // High priority shortcut (takes precedence)
 * useKeyboardShortcut("Escape", closeModal, {
 *   priority: 100,
 *   modal: true // Works even when modal is open
 * });
 *
 * @example
 * // Sheet-specific shortcut
 * useKeyboardShortcut("Escape", closeSheet, {
 *   sheet: true // Works when sheet is open
 * });
 *
 * @remarks
 * - Shortcuts are automatically ignored when typing in input fields, textareas, or contenteditable elements
 * - When multiple listeners match the same key, only the one with the highest priority executes
 * - By default, shortcuts are disabled when modals/sheets are open (unless `modal` or `sheet` is `true`)
 * - The hook requires a `KeyboardShortcutProvider` to be present in the component tree
 */
export function useKeyboardShortcut(
  key: KeyboardShortcutListener["key"],
  callback: (e: KeyboardEvent) => void,
  options: Pick<KeyboardShortcutListener, "enabled" | "priority" | "modal" | "sheet"> = {}
) {
  const id = useId();

  const { listeners, setListeners } = useContext(KeyboardShortcutContext);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (options.enabled === false) return;

      const target = e.target as HTMLElement;

      // Early return: ignore if typing in input/textarea
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      // Build pressed key first (cheap operation)
      const pressedKey = [
        ...(e.metaKey ? ["meta"] : []),
        ...(e.ctrlKey ? ["ctrl"] : []),
        ...(e.altKey ? ["alt"] : []),
        e.key,
      ].join("+");

      // Early return: ignore if key doesn't match this listener (before expensive DOM queries)
      if (Array.isArray(key) ? !key.includes(pressedKey) : pressedKey !== key) return;

      // Check for overlays once (lazy evaluation - only when key matches)
      // Use a single combined query for better performance instead of multiple queries
      const hasAnyOverlay = !!document.querySelector(OVERLAY_QUERY);

      // If overlay exists and this listener doesn't explicitly allow it, return early
      if (hasAnyOverlay && !options.modal && !options.sheet) return;

      // Find enabled listeners that match the key
      const matchingListeners = listeners.filter((l) => {
        // If overlay exists, only match listeners that explicitly allow it (modal or sheet flag)
        // If no overlay exists, match all listeners (modal/sheet flags don't matter)
        const shouldWork = hasAnyOverlay ? l.modal || l.sheet : true;

        return (
          l.enabled !== false &&
          shouldWork &&
          (Array.isArray(l.key) ? l.key.includes(pressedKey) : l.key === pressedKey)
        );
      });

      if (!matchingListeners.length) return;

      // Sort the listeners by priority
      const topListener = stableSort(matchingListeners, (a, b) => (b.priority ?? 0) - (a.priority ?? 0))[0];

      // Check if this is the top listener
      if (topListener?.id !== id) return;

      e.preventDefault();
      callback(e);
    },
    [key, listeners, id, callback, options.enabled, options.modal, options.sheet]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Register/unregister the listener
  useEffect(() => {
    setListeners((prev) => [...prev.filter((listener) => listener.id !== id), { id, key, ...options }]);

    return () => setListeners((prev) => prev.filter((listener) => listener.id !== id));
  }, [options.enabled, options.priority, key, options, id, setListeners]);
}
