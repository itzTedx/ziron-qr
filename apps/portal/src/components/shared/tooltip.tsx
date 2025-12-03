"use client";

import { ComponentProps, PropsWithChildren, ReactNode, useState } from "react";

import { TooltipContent, Tooltip as TooltipRoot, TooltipTrigger } from "@ziron/ui/components/tooltip";

import { cn } from "@ziron/utils";

export interface TooltipProps extends Omit<typeof TooltipContent, "content"> {
  content: ReactNode;
  className?: string;
  disabled?: boolean;
  side?: ComponentProps<typeof TooltipContent>["side"];
  disableHoverableContent?: ComponentProps<typeof TooltipRoot>["disableHoverableContent"];
  delayDuration?: ComponentProps<typeof TooltipRoot>["delayDuration"];
}

export const Tooltip = ({ content, disabled, children, side, ...props }: PropsWithChildren<TooltipProps>) => {
  const [open, setOpen] = useState(false);
  return (
    <TooltipRoot onOpenChange={setOpen} open={disabled ? false : open}>
      <TooltipTrigger
        asChild
        onBlur={() => {
          setOpen(false);
        }}
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={8}
        {...props}
        className={cn(
          "pointer-events-auto animate-slide-up-fade items-center overflow-hidden rounded-xl shadow-sm",
          props.className
        )}
      >
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
};
