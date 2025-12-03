import { Command } from "cmdk";
import { Lock } from "lucide-react";

import { cn } from "@ziron/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { DatePreset, DateRange, DateRangePreset, Preset } from "./types";

type PresetsProps<TPreset extends Preset, TValue> = {
  presets: TPreset[];
  onSelect: (preset: TPreset) => void;
  currentValue?: TValue;
  currentPresetId?: string;
};

const Presets = <TPreset extends Preset, TValue>({
  // Available preset configurations
  presets,
  // Event handler when a preset is selected
  onSelect,
  // Currently selected preset range value
  currentValue,
  // Currently selected preset id
  currentPresetId,
}: PresetsProps<TPreset, TValue>) => {
  // biome-ignore lint/suspicious/noExplicitAny: it's a valid type
  const isDateRangePresets = (preset: any): preset is DateRangePreset => "dateRange" in preset;

  // biome-ignore lint/suspicious/noExplicitAny: it's a valid type
  const isDatePresets = (preset: any): preset is DatePreset => "date" in preset;

  const compareDates = (date1: Date, date2: Date) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const compareRanges = (range1: DateRange, range2: DateRange) => {
    const from1 = range1.from;
    const from2 = range2.from;

    let equalFrom = false;

    if (from1 && from2) {
      const sameFrom = compareDates(from1, from2);

      if (sameFrom) equalFrom = true;
    }

    const to1 = range1.to;
    const to2 = range2.to;

    let equalTo = false;

    if (to1 && to2) {
      const sameTo = compareDates(to1, to2);

      if (sameTo) equalTo = true;
    }

    return equalFrom && equalTo;
  };

  const matchesCurrent = (preset: TPreset) => {
    if (currentPresetId) {
      return currentPresetId === preset.id;
    }

    if (isDateRangePresets(preset)) {
      const value = currentValue as DateRange | undefined;

      return value && compareRanges(value, preset.dateRange);
    }
    if (isDatePresets(preset)) {
      const value = currentValue as Date | undefined;

      return value && compareDates(value, preset.date);
    }

    return false;
  };

  return (
    <Command autoFocus className="w-full rounded ring-border ring-offset-2 focus:outline-none" loop tabIndex={0}>
      <Command.List className="*:flex *:w-full *:items-start *:gap-x-2 *:gap-y-0.5 *:sm:flex-col">
        {presets.map((preset) => {
          return (
            <Command.Item
              className={cn(
                "group relative flex cursor-pointer items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap rounded-sm border",
                "px-2.5 py-1.5 text-left text-foreground/80 text-sm shadow-sm outline-none sm:w-full sm:border-none sm:py-2 sm:shadow-none",
                "disabled:pointer-events-none disabled:opacity-50",
                "sm:data-[selected=true]:bg-muted/50",
                matchesCurrent(preset) && "font-semibold text-foreground"
              )}
              disabled={preset.requiresUpgrade}
              key={preset.id}
              onSelect={() => onSelect(preset)}
              title={preset.label}
              value={preset.id}
            >
              <span>{preset.label}</span>
              {preset.requiresUpgrade ? (
                <Lock aria-hidden="true" className="h-3.5 w-3.5" />
              ) : preset.shortcut ? (
                <kbd className="hidden rounded bg-muted/50 px-2 py-0.5 font-light text-muted-foreground text-xs group-data-[selected=true]:bg-muted/50 md:block">
                  {preset.shortcut.toUpperCase()}
                </kbd>
              ) : null}
              {preset.requiresUpgrade && preset.tooltipContent && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="absolute inset-0 cursor-not-allowed" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{preset.tooltipContent}</TooltipContent>
                </Tooltip>
              )}
            </Command.Item>
          );
        })}
      </Command.List>
    </Command>
  );
};

Presets.displayName = "DatePicker.Presets";

export { Presets };
