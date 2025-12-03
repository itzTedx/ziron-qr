import { ReactNode, useState } from "react";

import { IconCheck } from "@tabler/icons-react";
import { ChevronDown, SortDesc } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@ziron/ui/components/popover";

import { CardsSortSlug, cardsSortOptions } from "@ziron/db/schema";
import { cn } from "@ziron/utils/dist/cn";

export const CardSort = ({
  selectedSort,
  setSelectedSort,
}: {
  selectedSort: CardsSortSlug;
  setSelectedSort: (sort: CardsSortSlug) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group flex h-10 cursor-pointer appearance-none items-center gap-x-2 truncate rounded-md border px-3 text-sm outline-none transition-all",
            "bg-transparent text-muted-foreground placeholder-muted-foreground",
            "focus-visible:border-muted data-[state=open]:border-muted data-[state=open]:ring-4 data-[state=open]:ring-muted"
          )}
        >
          <SortDesc className="size-4" />
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-muted-foreground">
            {/* TODO: Add selected sort display */}
            Sort by
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-75 group-data-[state=open]:rotate-180" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2 md:w-48">
        {cardsSortOptions.map(({ display, slug }) => (
          <button
            className="flex w-full items-center justify-between space-x-2 rounded-md px-1 py-2 hover:bg-muted active:bg-muted-foreground/20"
            key={slug}
            onClick={() => {
              setSelectedSort(slug);
              setIsOpen(false);
            }}
          >
            <IconMenu icon={<SortDesc className="h-4 w-4" />} text={display} />
            {selectedSort === slug && <IconCheck aria-hidden="true" className="size-4" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

interface MenuIconProps {
  icon: ReactNode;
  text: string;
}

export function IconMenu({ icon, text }: MenuIconProps) {
  return (
    <div className="flex items-center justify-start space-x-2 truncate">
      {icon}
      <p className="truncate text-sm">{text}</p>
    </div>
  );
}
