import { Suspense } from "react";

import Link from "next/link";

import { Skeleton } from "@ziron/ui/components/skeleton";

import { cn } from "@ziron/utils";

import { SidebarLinkItem } from "./sidebar-link-item";

export const sidebarLinkClassNames = cn(
  "inset-shadow-white/78 inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 ease-tact hover:bg-muted/50 data-[active=true]:inset-shadow-2xs data-[active=true]:bg-brand-secondary/10 data-[active=true]:font-medium data-[active=true]:text-brand-secondary data-[active=true]:shadow-xs data-[active=true]:hover:bg-brand-secondary/20 dark:inset-shadow-white/12"
);

export function SidebarLink({ href, children, icon }: React.ComponentProps<typeof SidebarLinkItem>) {
  return (
    <Suspense
      fallback={
        <SidebarLinkSkeleton href={href} icon={icon}>
          {children}
        </SidebarLinkSkeleton>
      }
    >
      <SidebarLinkItem className={cn(sidebarLinkClassNames)} href={href} icon={icon}>
        {children}
      </SidebarLinkItem>
    </Suspense>
  );
}

function SidebarLinkSkeleton({ href, children, icon }: React.ComponentProps<typeof SidebarLinkItem>) {
  return (
    <Link className={sidebarLinkClassNames} href={href}>
      <span className="shrink-0">{icon}</span>
      <span className="shrink-0 grow text-sm">{children}</span>

      <Skeleton className="h-4 w-full" />
    </Link>
  );
}
