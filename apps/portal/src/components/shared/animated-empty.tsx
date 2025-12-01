"use client";

import { CSSProperties, PropsWithChildren, ReactNode } from "react";

import { Route } from "next";
import Link from "next/link";

import { Badge } from "@ziron/ui/components/badge";
import { buttonVariants } from "@ziron/ui/components/button";

import { cn } from "@ziron/utils";

export function AnimatedEmptyState({
  title,
  description,
  cardContent,
  cardCount = 3,
  addButton,
  pillContent,
  learnMoreHref,
  learnMoreTarget = "_blank",
  learnMoreClassName,
  learnMoreText,
  className,
  cardClassName,
}: {
  title: string;
  description: ReactNode;
  cardContent: ReactNode | ((index: number) => ReactNode);
  cardCount?: number;
  addButton?: ReactNode;
  pillContent?: string;
  learnMoreHref?: Route;
  learnMoreTarget?: string;
  learnMoreClassName?: string;
  learnMoreText?: string;
  className?: string;
  cardClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 rounded-lg border border-neutral-200 px-4 py-10 md:min-h-[500px]",
        className
      )}
    >
      <div className="mask-[linear-gradient(transparent,black_10%,black_90%,transparent)] h-36 w-full max-w-64 animate-fade-in overflow-hidden px-4">
        <div
          className="animation-duration-[10s] flex animate-infinite-scroll-y flex-col"
          style={{ "--scroll": "-50%" } as CSSProperties}
        >
          {[...Array(cardCount * 2)].map((_, idx) => (
            <Card className={cardClassName} key={`card-${idx + 1}`}>
              {typeof cardContent === "function" ? cardContent(idx % cardCount) : cardContent}
            </Card>
          ))}
        </div>
      </div>
      {pillContent && <Badge variant="gradient">{pillContent}</Badge>}
      <div className="max-w-sm text-pretty text-center">
        <span className="font-medium text-base text-neutral-900">{title}</span>
        <div className="mt-2 text-pretty text-neutral-500 text-sm">{description}</div>
      </div>
      <div className="flex items-center gap-2">
        {addButton}
        {learnMoreHref && (
          <Link
            className={cn(
              buttonVariants({ variant: addButton ? "secondary" : "default" }),
              "flex h-9 items-center whitespace-nowrap rounded-lg border px-4 text-sm",
              learnMoreClassName
            )}
            href={learnMoreHref}
            target={learnMoreTarget}
          >
            {learnMoreText || "Learn more"}
          </Link>
        )}
      </div>
    </div>
  );
}

function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-[0_4px_12px_0_#0000000D]",
        className
      )}
    >
      {children}
    </div>
  );
}
