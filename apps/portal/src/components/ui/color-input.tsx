"use client";

import { memo, useCallback, useMemo, useState } from "react";

import { HexColorPicker } from "react-colorful";

import { Button } from "@ziron/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ziron/ui/components/drawer";
import { Input } from "@ziron/ui/components/input";
import { RadioGroup, RadioGroupItem } from "@ziron/ui/components/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ziron/ui/components/tooltip";
import { useIsMobile } from "@ziron/ui/hooks";

import { useDebouncedCallback } from "@/hooks/debounce-callback";

const HEX_VALUES = [
  {
    color: "Blue",
    value: "#3b82f6",
  },
  {
    color: "Indigo",
    value: "#6366f1",
  },
  {
    color: "Pink",
    value: "#ec4899",
  },
  {
    color: "Red",
    value: "#ef4444",
  },
  {
    color: "orange",
    value: "#f97316",
  },
  {
    color: "yellow",
    value: "#eab308",
  },
  {
    color: "Green",
    value: "#22c55e",
  },
] as const;

// Validation helper
const isValidHexColor = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

const ColorRadioItem = memo(({ value, color }: { value: string; color: string }) => (
  <RadioGroupItem
    aria-label={color}
    className="text-foreground"
    id={color}
    key={color}
    style={{
      borderColor: value,
      backgroundColor: value,
    }}
    value={value}
  />
));
ColorRadioItem.displayName = "ColorRadioItem";

interface Props {
  value?: string;
  onChange: (newValue: string) => void;
}

export default function ColorsInput({ value = "#4938ff", onChange }: Props) {
  const [color, setColor] = useState(value);

  const onColorChange = useDebouncedCallback((newColor: string) => {
    if (isValidHexColor(newColor)) {
      onChange(newColor);
      setColor(newColor);
    }
  }, 500);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (!newValue.startsWith("#")) {
        newValue = `#${newValue.replace("#", "")}`;
      }
      setColor(newValue);
      if (isValidHexColor(newValue)) {
        onColorChange(newValue);
      }
    },
    [onColorChange]
  );

  const colorItems = useMemo(
    () => HEX_VALUES.map((item) => <ColorRadioItem color={item.color} key={item.color} value={item.value} />),
    []
  );

  return (
    <fieldset className="flex gap-5 max-sm:flex-col sm:items-center">
      <RadioGroup className="flex gap-3" onValueChange={onColorChange} value={color}>
        {colorItems}
      </RadioGroup>
      <div
        className="flex overflow-hidden rounded-md border-2 md:items-center"
        style={{
          borderColor: color,
        }}
      >
        <MemoizedResponsiveInput value={color}>
          <HexColorPicker className="size-64!" color={color} onChange={onColorChange} />
        </MemoizedResponsiveInput>

        <Input
          className="h-9 w-24 rounded-none border-0 focus-visible:ring-0"
          onChange={handleInputChange}
          value={color}
        />
      </div>
    </fieldset>
  );
}

const ResponsiveInput = memo(({ value, children }: { value: string; children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger
          className="size-9 shrink-0"
          style={{
            backgroundColor: value,
          }}
          type="button"
        />
        <DrawerContent className="items-center gap-4">
          <DrawerHeader>
            <DrawerTitle>Customize Color</DrawerTitle>
          </DrawerHeader>
          {children}
          <DrawerFooter className="w-full">
            <Button>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Tooltip>
      <TooltipProvider delayDuration={0}>
        <TooltipTrigger
          className="size-9 shrink-0"
          style={{
            backgroundColor: value,
          }}
          type="button"
        />
        <TooltipContent className="p-4">{children}</TooltipContent>
      </TooltipProvider>
    </Tooltip>
  );
});
ResponsiveInput.displayName = "ResponsiveInput";

const MemoizedResponsiveInput = memo(ResponsiveInput);
