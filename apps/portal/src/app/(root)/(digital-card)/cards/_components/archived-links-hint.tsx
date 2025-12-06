import { Suspense } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsBoolean, useQueryState } from "nuqs";

import { Button } from "@ziron/ui/components/button";
import { Skeleton } from "@ziron/ui/components/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";

import { pluralize } from "@ziron/utils";

import { BoxArchive } from "@/assets/icons";

import { orpc } from "@/lib/orpc/client";

export default function ArchivedLinksHint() {
  const [showArchived, setShowArchived] = useQueryState("showArchived", parseAsBoolean.withDefault(false));
  return !showArchived && <ArchivedLinksHintHelper setShowArchived={setShowArchived} />;
}

function ArchivedLinksHintHelper({ setShowArchived }: { setShowArchived: (showArchived: boolean) => void }) {
  const { data: nonArchivedCount } = useSuspenseQuery(orpc.card.count.queryOptions({ input: { showArchived: false } }));
  const { data: totalCount } = useSuspenseQuery(orpc.card.count.queryOptions({ input: {} }));

  const archivedCount = (totalCount ?? 0) - (nonArchivedCount ?? 0);

  return (
    archivedCount > 0 && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" type="button" variant="ghost">
            <BoxArchive className="size-3" />
            <Suspense fallback={<Skeleton className="size-4" />}>{archivedCount}</Suspense>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-4">
            <span>
              You have <span className="font-medium">{archivedCount}</span> archived {pluralize("link", archivedCount)}{" "}
              that match{archivedCount === 1 && "es"}
              the applied filters
            </span>

            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/80"
              onClick={() => setShowArchived(true)}
              size="sm"
              variant="secondary"
            >
              Show archived links
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    )
  );
}
