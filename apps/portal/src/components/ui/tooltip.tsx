"use client";

import { ReactNode, useState } from "react";

import Link from "next/link";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";

import { Badge } from "@ziron/ui/components/badge";
import { Button, ButtonProps, buttonVariants } from "@ziron/ui/components/button";
import { cn } from "@ziron/utils";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <TooltipPrimitive.Provider delayDuration={150}>{children}</TooltipPrimitive.Provider>;
}

export interface TooltipProps extends Omit<TooltipPrimitive.TooltipContentProps, "content"> {
  content: React.ReactNode | string | ((props: { setOpen: (open: boolean) => void }) => ReactNode);
  contentClassName?: string;
  disableHoverableContent?: TooltipPrimitive.TooltipProps["disableHoverableContent"];
}

export function Tooltip({
  children,
  content,
  contentClassName,
  side = "top",
  disableHoverableContent,
  ...rest
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipPrimitive.Root
      delayDuration={0}
      disableHoverableContent={disableHoverableContent}
      onOpenChange={setOpen}
      open={open}
    >
      <TooltipPrimitive.Trigger
        asChild
        onBlur={() => {
          setOpen(false);
        }}
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className="pointer-events-auto z-[99] animate-slide-up-fade items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          collisionPadding={0}
          side={side}
          sideOffset={8}
          {...rest}
        >
          {typeof content === "string" ? (
            <span
              className={cn("block max-w-xs text-pretty px-4 py-2 text-center text-gray-700 text-sm", contentClassName)}
            >
              {content}
            </span>
          ) : typeof content === "function" ? (
            content({ setOpen })
          ) : (
            content
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export function TooltipContent({
  title,
  cta,
  href,
  target,
  onClick,
}: {
  title: React.ReactNode;
  cta?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex max-w-xs flex-col items-center space-y-3 p-4 text-center">
      <p className="text-gray-700 text-sm">{title}</p>
      {cta &&
        (href ? (
          <Link
            href={href}
            {...(target ? { target } : {})}
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex h-9 w-full items-center justify-center whitespace-nowrap rounded-lg border px-4 text-sm"
            )}
          >
            {cta}
          </Link>
        ) : onClick ? (
          <Button className="h-9" onClick={onClick} variant="default">
            {cta}
          </Button>
        ) : null)}
    </div>
  );
}

export function SimpleTooltipContent({ title, cta, href }: { title: string; cta?: string; href?: string }) {
  return (
    <div className="max-w-xs px-4 py-2 text-center text-gray-700 text-sm">
      {title}{" "}
      {cta && href && (
        <Link
          className="inline-flex text-gray-500 underline underline-offset-4 hover:text-gray-800"
          href={href}
          onClick={(e) => e.stopPropagation()}
          rel="noopener noreferrer"
          target="_blank"
        >
          {cta}
        </Link>
      )}
    </div>
  );
}

export function InfoTooltip(props: Omit<TooltipProps, "children">) {
  return (
    <Tooltip {...props}>
      <HelpCircle className="h-4 w-4 text-gray-500" />
    </Tooltip>
  );
}

export function BadgeTooltip({ children, content, ...props }: TooltipProps) {
  return (
    <Tooltip content={content} {...props}>
      <div className="flex cursor-pointer items-center">
        <Badge className="border-gray-300 transition-all hover:bg-gray-200" variant="default">
          {children}
        </Badge>
      </div>
    </Tooltip>
  );
}

export function ButtonTooltip({
  children,
  tooltipProps,
  ...props
}: {
  children: ReactNode;
  tooltipProps: TooltipProps;
} & ButtonProps) {
  return (
    <Tooltip {...tooltipProps}>
      <button
        type="button"
        {...props}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-md text-gray-500 transition-colors duration-75 hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          props.className
        )}
      >
        {children}
      </button>
    </Tooltip>
  );
}
