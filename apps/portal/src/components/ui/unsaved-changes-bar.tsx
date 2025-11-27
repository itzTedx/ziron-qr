"use client";

import { AnimatePresence, motion } from "motion/react";

import { Button } from "@ziron/ui/components/button";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";

import { cn } from "@ziron/utils";

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
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "lg:filter-[drop-shadow(0_5px_8px_#222A351d)] sticky bottom-0 w-full overflow-hidden lg:bottom-4",
            className
          )}
          exit={{ y: 100, opacity: 0 }}
          initial={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
