import Link from "next/link";

import { IconPlus } from "@tabler/icons-react";

import { IconEmptyCard } from "@ziron/ui/assets/icons/empty-card";
import { Button } from "@ziron/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@ziron/ui/components/empty";

interface Props {
  id: string;
}

export const EmptyCard = ({ id }: Props) => {
  return (
    <Empty className="col-span-full border border-dashed">
      <EmptyHeader>
        <EmptyMedia>
          <IconEmptyCard className="invert dark:invert-0" />
        </EmptyMedia>
        <EmptyTitle>No Cards Available</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any cards yet. Get started by creating your first card.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild className="gap-2" size="sm">
            <Link href={`/card/new?organizationId=${id}`}>
              <IconPlus /> Create a Card
            </Link>
          </Button>
          <Button size="sm" variant="outline">
            Import Card
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};
