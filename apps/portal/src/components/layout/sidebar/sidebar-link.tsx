import { Suspense } from "react";

import { Skeleton } from "@ziron/ui/components/skeleton";

import { SidebarLinkItem } from "./sidebar-link-item";

export function SidebarLink({ href, children, icon }: React.ComponentProps<typeof SidebarLinkItem>) {
  return (
    <Suspense fallback={<SidebarLinkSkeleton />}>
      <SidebarLinkItem href={href} icon={icon}>
        {children}
      </SidebarLinkItem>
    </Suspense>
  );
}

function SidebarLinkSkeleton() {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Skeleton className="size-4" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}
