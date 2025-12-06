import { memo } from "react";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { IconCheck, IconCopy, IconEdit } from "@tabler/icons-react";

import { IconMouse } from "@ziron/ui/assets/icons/mouse";
import { Badge } from "@ziron/ui/components/badge";
import { Button } from "@ziron/ui/components/button";
import { Card, CardContent, CardFooter } from "@ziron/ui/components/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";
import { useCopyToClipboard } from "@ziron/ui/hooks";

import type { CardTypeWithPageVisits } from "@ziron/db/schema";
import { cn, formatDate, pluralize } from "@ziron/utils";

import { BoxArchive } from "@/assets/icons";
import { ExpandingArrow } from "@/assets/icons/expanding-arrows";

import { constructUrl, getPrettyUrl } from "@/lib/link/construct-url";

import ShareButton from "./share-button";

type PersonCardFields = Pick<
  CardTypeWithPageVisits,
  "id" | "name" | "designation" | "slug" | "image" | "cover" | "createdAt" | "pageVisits" | "archivedAt"
>;

interface PersonCardProps {
  card: PersonCardFields;
  isSelectMode?: boolean;
  setIsSelectMode?: (isSelectMode: boolean) => void;
  selectedCardIds?: string[];
  handleCardSelection?: (cardId: string, e: React.MouseEvent) => void;
  variant?: "cards" | "rows";
}

export const PersonCard = ({
  card,
  isSelectMode,
  setIsSelectMode,
  selectedCardIds = [],
  handleCardSelection,
  variant = "cards",
}: PersonCardProps) => {
  const { copyToClipboard } = useCopyToClipboard();

  function handleCopyLink() {
    if (!card.slug) return;
    copyToClipboard(constructUrl(card.slug));
  }

  if (variant === "rows") {
    return (
      <div className="group relative flex items-center justify-between border border-b px-3 py-2 [corner-shape:squircle] first-of-type:rounded-t-lg first-of-type:border-t last-of-type:rounded-b-lg hover:bg-accent sm:p-3 sm:last-of-type:rounded-b-xl sm:first-of-type:rounded-t-xl">
        <div className="flex items-center gap-2 md:gap-3">
          <div onMouseDown={() => setIsSelectMode?.(true)} onMouseUp={() => setIsSelectMode?.(false)}>
            <CardIcon
              card={card}
              handleCardSelection={handleCardSelection}
              isSelectMode={isSelectMode ?? false}
              selectedCardIds={selectedCardIds}
            />
          </div>
          <h3 className="text-nowrap font-semibold text-sm sm:text-base">{card.name}</h3>
          <Button onClick={handleCopyLink} size="icon-sm" variant="ghost">
            <IconCopy />
          </Button>
          {/* <IconArrowRight className="size-4 text-muted-foreground/50" /> */}
          <ExpandingArrow className="-ml-3.5 invisible size-3.5 text-muted-foreground/50 group-hover:visible" />
          <p className="truncate text-muted-foreground text-sm">{getPrettyUrl(constructUrl(card.slug))}</p>
          <Tooltip>
            <TooltipTrigger className="text-nowrap text-sm">
              {formatDate(card.createdAt, { showYear: false })}
            </TooltipTrigger>
            <TooltipContent>Created on {formatDate(card.createdAt, { showYear: false })}</TooltipContent>
          </Tooltip>
        </div>
        <div>
          <Badge variant="secondary">
            <IconMouse /> {card.pageVisits?.length}{" "}
            <span className="hidden md:inline">{pluralize("click", card.pageVisits?.length)}</span>
          </Badge>
        </div>
      </div>
    );
  }
  return (
    <Card className="relative overflow-hidden pt-10">
      <Badge className="absolute top-2 right-2 z-10" variant="secondary">
        <IconMouse /> {card.pageVisits?.length} {pluralize("click", card.pageVisits?.length)}
      </Badge>
      <CardContent className="flex flex-col items-center justify-between p-0">
        <Image
          alt="Cover Image"
          className="absolute top-0 h-24 w-full object-cover"
          height={112}
          quality={70}
          src={card.cover ?? "/images/placeholder-cover.jpg"}
          width={260}
        />
        <div className="z-10 flex flex-col items-center pb-3 text-center">
          <CardIcon
            card={card}
            handleCardSelection={handleCardSelection}
            isSelectMode={isSelectMode ?? false}
            selectedCardIds={selectedCardIds}
          />
          <h3 className="mt-2 font-semibold">{card.name}</h3>
          <p className="text-muted-foreground text-sm">{card.designation}</p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto border-t">
        <Button asChild className="w-full flex-1 gap-1.5" size="sm" variant="ghost">
          <Link href={`cards/${card.id}` as Route}>
            <IconEdit className="size-3.5 sm:size-4" />
            <span className="text-xs sm:text-sm">Edit</span>
          </Link>
        </Button>

        <ShareButton cardId={card.id} />
      </CardFooter>
    </Card>
  );
};

const LOGO_SIZE_CLASS_NAME = "size-4 sm:size-6 group-data-[variant=cards]/card-list:sm:size-28";

const CardIcon = memo(
  ({
    card,
    isSelectMode,
    selectedCardIds,
    handleCardSelection,
  }: {
    card: PersonCardFields;
    isSelectMode: boolean;
    selectedCardIds: string[];
    handleCardSelection?: (cardId: string, e: React.MouseEvent) => void;
  }) => {
    const isSelected = selectedCardIds.includes(card.id);

    return (
      <button
        aria-checked={isSelected}
        className={cn(
          "group relative shrink-0 items-center justify-center outline-none",
          isSelectMode ? "flex" : "hidden sm:flex"
        )}
        data-checked={isSelected}
        onClick={(e) => {
          e.stopPropagation();
          handleCardSelection?.(card.id, e);
        }}
        role="checkbox"
        type="button"
      >
        {/* Link logo background circle */}
        <div className="absolute inset-0 shrink-0 rounded-full border opacity-0 transition-opacity group-data-[variant=cards]/card-list:sm:opacity-100">
          <div className="h-full w-full rounded-full border border-card bg-linear-to-t from-background backdrop-blur-lg" />
        </div>
        <div className="relative transition-[padding,transform] group-hover:scale-90 group-data-[variant=cards]/card-list:sm:p-2">
          <div className="group-data-[variant=rows]/card-list:hidden group-data-[variant=rows]/card-list:sm:block">
            {card.archivedAt ? (
              <BoxArchive
                className={cn(
                  "shrink-0 p-0.5 text-muted-foreground transition-[width,height] group-data-[variant=cards]/card-list:p-3",
                  LOGO_SIZE_CLASS_NAME
                )}
              />
            ) : (
              <Image
                alt={`${card.name}'s Photo`}
                className={cn("shrink-0 rounded-full transition-[width,height]", LOGO_SIZE_CLASS_NAME)}
                height={120}
                loading="lazy"
                src={card.image}
                width={120}
              />
            )}
          </div>
          <div className="size-5 group-data-[variant=cards]/card-list:size-6 sm:hidden" />
        </div>
        {/* Checkbox */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center rounded-full border bg-card ring-0 ring-black/5",
            "opacity-100 max-sm:ring sm:opacity-0",
            "transition-all duration-150 group-hover:opacity-100 group-hover:ring group-focus-visible:opacity-100 group-focus-visible:ring",
            "group-data-[checked=true]:opacity-100"
          )}
        >
          <div
            className={cn(
              "rounded-full bg-foreground p-0.5 group-data-[variant=cards]/card-list:p-1",
              "scale-90 opacity-0 transition-[transform,opacity] duration-100 group-data-[checked=true]:scale-100 group-data-[checked=true]:opacity-100"
            )}
          >
            <IconCheck className="size-3 text-card" />
          </div>
        </div>
      </button>
    );
  }
);
