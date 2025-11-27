"use client";

import { useEffect, useState } from "react";

import { Button } from "@ziron/ui/components/button";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";

import { cn } from "@ziron/utils";

const EXIT_DURATION_MS = 200;

interface UnsavedChangesBarProps {
  onSave: () => void;
  onDiscard: () => void;
  isSaving?: boolean;
  className?: string;
  show?: boolean;
}

export function UnsavedChangesBar({
  onSave,
  onDiscard,
  isSaving = false,
  className,
  show = true,
}: UnsavedChangesBarProps) {
  const [isMounted, setIsMounted] = useState(show);

  useEffect(() => {
    if (show) {
      setIsMounted(true);
      return;
    }

    const timeoutId = window.setTimeout(() => setIsMounted(false), EXIT_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [show]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "lg:filter-[drop-shadow(0_5px_8px_#222A351d)] sticky bottom-0 w-full overflow-hidden lg:bottom-4",
        show
          ? ["duration-300", "animate-in", "fade-in", "slide-in-from-bottom-4"]
          : ["duration-200", "animate-out", "fade-out", "slide-out-to-bottom-4"],
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between rounded-lg border bg-background px-4 py-3 shadow-lg">
        <span className="font-medium text-foreground text-sm">Unsaved changes</span>
        <div className="flex items-center gap-3">
          <Button disabled={isSaving} onClick={onDiscard} type="button" variant="outline">
            Discard
          </Button>
          <Button disabled={isSaving} onClick={onSave} type="button" variant="secondary">
            <LoadingSwap isLoading={isSaving}>Save changes</LoadingSwap>
          </Button>
        </div>
      </div>
    </div>
  );
}
