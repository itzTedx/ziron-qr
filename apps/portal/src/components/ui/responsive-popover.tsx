"use client";

import { PropsWithChildren, ReactNode, WheelEventHandler } from "react";

import { Drawer, DrawerContent, DrawerTrigger } from "@ziron/ui/components/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@ziron/ui/components/popover";
import { useIsMobile } from "@ziron/ui/hooks/use-mobile";

import { cn } from "@ziron/utils";

export type PopoverProps = PropsWithChildren<{
  content: ReactNode | string;
  align?: "center" | "start" | "end";
  side?: "bottom" | "top" | "left" | "right";
  openPopover: boolean;
  setOpenPopover: (open: boolean) => void;
  mobileOnly?: boolean;
  popoverContentClassName?: string;
  collisionBoundary?: Element | Element[];
  sticky?: "partial" | "always";
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onWheel?: WheelEventHandler;
}>;

export function ResponsivePopover({
  children,
  content,
  align = "center",
  side = "bottom",
  openPopover,
  setOpenPopover,
  mobileOnly,
  popoverContentClassName,
  collisionBoundary,
  sticky,
  onEscapeKeyDown,
  onWheel,
}: PopoverProps) {
  const isMobile = useIsMobile();

  if (mobileOnly || isMobile) {
    return (
      <Drawer onOpenChange={setOpenPopover} open={openPopover}>
        <DrawerTrigger asChild className="sm:hidden">
          {children}
        </DrawerTrigger>

        <DrawerContent>{content}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover onOpenChange={setOpenPopover} open={openPopover}>
      <PopoverTrigger asChild className="sm:inline-flex">
        {children}
      </PopoverTrigger>

      <PopoverContent
        align={align}
        className={cn(
          "z-50 w-fit animate-slide-up-fade items-center rounded-lg border p-3 drop-shadow-lg sm:block",
          popoverContentClassName
        )}
        collisionBoundary={collisionBoundary}
        onEscapeKeyDown={onEscapeKeyDown}
        onWheel={onWheel}
        side={side}
        sideOffset={8}
        sticky={sticky}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
