"use client";

import { IconLink } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { IconMouse } from "@ziron/ui/assets/icons/mouse";

import { orpc } from "@/lib/orpc/client";

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

export const UsageMetrics = () => {
  const { data: metrics } = useSuspenseQuery(orpc.metrics.get.queryOptions());

  // For now, using placeholder values until we have actual event and link tracking
  const eventsUsed = 0;
  const eventsLimit = 1000;
  const linksUsed = metrics?.totalCards ?? 0;
  const linksLimit = 25;

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <IconMouse className="size-4 text-muted-foreground" />
          <span className="text-foreground text-sm">Events</span>
        </div>
        <span className="text-muted-foreground text-sm">
          {eventsUsed} of {formatNumber(eventsLimit)}
        </span>
      </div>
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <IconLink className="size-4 text-muted-foreground" />
          <span className="text-foreground text-sm">Links</span>
        </div>
        <span className="text-muted-foreground text-sm">
          {linksUsed} of {linksLimit}
        </span>
      </div>
    </div>
  );
};
