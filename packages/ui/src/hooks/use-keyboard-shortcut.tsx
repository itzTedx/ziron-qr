import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useId, useState } from "react";

import { stableSort } from "@ziron/utils";

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
