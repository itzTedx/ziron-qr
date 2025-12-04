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
        "sticky bottom-0 w-full lg:bottom-4",
        show
          ? ["duration-300", "animate-in", "fade-in", "slide-in-from-bottom-4"]
          : ["duration-200", "animate-out", "fade-out", "slide-out-to-bottom-4"],
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg sm:flex-row sm:items-center sm:justify-between lg:shadow-lg">
        <span className="font-medium text-foreground text-sm">Unsaved changes</span>
        <div className="flex items-center gap-3">
          <Button
            className="flex-1 sm:flex-initial"
            disabled={isSaving}
            onClick={onDiscard}
            size="sm"
            type="button"
            variant="outline"
          >
            Discard
          </Button>
          <Button
            className="flex-1 sm:flex-initial"
            disabled={isSaving}
            onClick={onSave}
            size="sm"
            type="button"
            variant="inverted"
          >
            <LoadingSwap isLoading={isSaving}>Save changes</LoadingSwap>
          </Button>
        </div>
      </div>
    </div>
  );
}
