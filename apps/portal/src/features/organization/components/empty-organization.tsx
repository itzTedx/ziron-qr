import { IconPlus } from "@tabler/icons-react";

import { IconDiamondArrowRight } from "@ziron/ui/assets/icons/arrows";
import { IconFlag } from "@ziron/ui/assets/icons/flag";
import { IconWorldPointer } from "@ziron/ui/assets/icons/world";
import { Button } from "@ziron/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@ziron/ui/components/empty";

export const EmptyOrganization = () => {
  return (
    <Empty className="col-span-full border border-dashed">
      <EmptyHeader>
        <EmptyMedia>
          <div className="mask-[linear-gradient(transparent,black_25%,black_75%,transparent)] h-36 w-full max-w-64 animate-fade-in overflow-hidden px-4">
            <div
              className="animation-duration-[10s] flex animate-infinite-scroll-y flex-col"
              style={{ "--scroll": "-50%" } as React.CSSProperties}
            >
              <OrganizationSkeleton />
              <OrganizationSkeleton />
              <OrganizationSkeleton />
              <OrganizationSkeleton />
              <OrganizationSkeleton />
              <OrganizationSkeleton />
            </div>
          </div>
        </EmptyMedia>
        <EmptyTitle>You haven&apos;t created any organizations yet.</EmptyTitle>
        <EmptyDescription>
          Get started by creating shared templates to streamline UTM campaign management across your team.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button className="gap-1.5" size="sm">
            <IconPlus className="size-3" /> Create Organization
          </Button>
          <Button size="sm" variant="outline">
            Import
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};

export function OrganizationSkeleton() {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-lg border border-muted/50 bg-card p-4 shadow-lg">
      <IconDiamondArrowRight className="size-4 text-muted-foreground" />
      <div className="h-2.5 w-24 min-w-0 rounded-sm bg-muted" />
      <div className="hidden grow items-center justify-end gap-1.5 text-stone-500 sm:flex">
        <IconWorldPointer className="size-4 text-muted-foreground" />
        <IconFlag className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}
