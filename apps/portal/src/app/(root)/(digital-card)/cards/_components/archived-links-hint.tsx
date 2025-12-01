import { Suspense } from "react";

import { useQuery } from "@tanstack/react-query";
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
  const { data: count } = useQuery(orpc.card.count.queryOptions({ input: { showArchived: false } }));
  const { data: totalCount } = useQuery(orpc.card.count.queryOptions({ input: { showArchived: true } }));

  //   const archivedCount = 12;
  const archivedCount = (totalCount ?? 0) - (count ?? 0);

  return (
    archivedCount > 0 && (
      <Tooltip>
        <TooltipTrigger>
          <div className="flex cursor-default items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-0.5 font-medium text-neutral-950 text-sm hover:bg-neutral-200">
            <BoxArchive className="h-3 w-3" />
            <Suspense fallback={<Skeleton className="size-4" />}>{archivedCount}</Suspense>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="px-3 py-2">
            <div className="flex items-center gap-4">
              <span>
                You have <span className="font-medium">{archivedCount}</span> archived{" "}
                {pluralize("link", archivedCount)} that match
                {/* {archivedCount === 1 && "es"} */}
                the applied filters
              </span>
              <div>
                <Button className="h-6 px-2" onClick={() => setShowArchived(true)} variant="secondary">
                  Show archived links
                </Button>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )
  );
}
