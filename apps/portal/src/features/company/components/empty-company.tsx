import Link from "next/link";

import { IconFolderCode, IconPlus } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@ziron/ui/components/empty";

interface Props {
  id: string;
}

export const EmptyCompany = ({ id }: Props) => {
  return (
    <Empty className="col-span-full border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No Cards Available</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any cards yet. Get started by creating your first card.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild className="gap-2">
            <Link href={`/card/new?companyId=${id}`}>
              <IconPlus className="size-4" /> Create a Card
            </Link>
          </Button>
          <Button variant="outline">Import Card</Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};
