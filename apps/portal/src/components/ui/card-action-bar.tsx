"use client";

import { useFormContext, useFormState } from "react-hook-form";

import { Button } from "@ziron/ui/components/button";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";

import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

interface CardActionBarProps {
  isSaving?: boolean;
}

export function CardActionBar({ isSaving = false }: CardActionBarProps) {
  const { control, reset } = useFormContext<zCardSchema>();
  const { isDirty, isSubmitting } = useFormState({
    control,
  });

  const showActionBar = isDirty || isSubmitting;

  return (
    <div className={cn("sticky bottom-3 z-50 w-full lg:bottom-4")}>
      <div
        className={cn(
          "mx-auto flex max-w-xl flex-col gap-3 rounded-lg border bg-accent/85 px-4 py-3 shadow-lg backdrop-blur-xl [corner-shape:squircle] sm:flex-row sm:items-center sm:justify-between lg:shadow-lg",
          "duration-300 ease-tact-in lg:transition-[opacity,translate,scale]",
          !showActionBar && "lg:translate-y-4 lg:scale-95 lg:opacity-0"
        )}
      >
        <span className="font-medium text-foreground text-sm">Unsaved changes</span>
        <div className="flex items-center gap-3">
          <Button
            className="flex-1 sm:flex-initial"
            disabled={isSaving}
            onClick={() => reset()}
            size="sm"
            type="button"
            variant="outline"
          >
            Discard
          </Button>
          <Button className="flex-1 sm:flex-initial" disabled={isSaving} size="sm" type="submit" variant="inverted">
            <LoadingSwap isLoading={isSaving}>Save changes</LoadingSwap>
          </Button>
        </div>
      </div>
    </div>
  );
}
