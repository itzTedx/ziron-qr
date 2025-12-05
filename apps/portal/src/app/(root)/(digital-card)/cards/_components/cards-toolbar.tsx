"use client";

import { ComponentType, memo, ReactNode, Suspense, SVGProps, useMemo, useState } from "react";

import { CircleCheck, Trash, X } from "lucide-react";

import { AnimatedSizeContainer } from "@ziron/ui/components/animated-size-container";
import { Button } from "@ziron/ui/components/button";
import { PaginationState } from "@ziron/ui/components/table";

import { CardType } from "@ziron/db/schema";
import { cn } from "@ziron/utils";

import { CreateButton } from "@/components/ui/create-button";

import { BoxArchive } from "@/assets/icons";

import { ArchiveCardModal } from "./archive-card-modal";
import ArchivedLinksHint from "./archived-links-hint";
import { DeleteCardModal } from "./delete-card-modal";
import { PaginationControls } from "./pagination";

interface Props {
  cards: CardType[];
  cardsCount: number;
  isSelectMode: boolean;
  setIsSelectMode: (isSelectMode: boolean) => void;
  selectedCardsId: string[];
  setSelectedCardsId: (selectedCardsId: string[]) => void;
}

type BulkAction = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  action: () => void;
  disabledTooltip?: string | ReactNode;
  keyboardShortcut?: string;
};

export const CardsToolbar = memo(
  ({ cards, cardsCount, isSelectMode, setIsSelectMode, selectedCardsId, setSelectedCardsId }: Props) => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 1,
      pageSize: 10,
    });

    const [showArchiveCardModal, setShowArchiveCardModal] = useState(false);
    const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);

    const selectedCards = useMemo(
      () => cards.filter(({ id }) => selectedCardsId.includes(id)),
      [cards, selectedCardsId]
    );

    const bulkActions: BulkAction[] = useMemo(
      () => [
        {
          label: selectedCards.length && selectedCards.every(({ archivedAt }) => archivedAt) ? "Unarchive" : "Archive",
          icon: BoxArchive,
          action: () => setShowArchiveCardModal(true),
          keyboardShortcut: "a",
        },
        {
          label: "Delete",
          icon: Trash,
          action: () => setShowDeleteCardModal(true),
          disabledTooltip: selectedCards.some(({ organizationId }) => organizationId)
            ? "You can't delete a card that's part of a program."
            : undefined,
          keyboardShortcut: "x",
        },
      ],
      [selectedCards]
    );

    const isSelecting = isSelectMode || selectedCardsId.length > 0;

    return (
      <>
        {selectedCards.length > 0 && (
          <>
            <ArchiveCardModal
              cards={selectedCards}
              setShowArchiveCardModalAction={setShowArchiveCardModal}
              showArchiveCardModal={showArchiveCardModal}
            />
            <DeleteCardModal
              cards={selectedCards}
              setShowDeleteCardModal={setShowDeleteCardModal}
              showDeleteCardModal={showDeleteCardModal}
            />
          </>
        )}
        <div className="h-[120px]" />

        <div className="fixed bottom-5 left-0 z-10 w-full [--left:280px] sm:max-[1372px]:w-[calc(100%-150px)] md:left-(--left) md:w-[calc(100%-var(--left))] md:max-[1372px]:w-[calc(100%-var(--left)-150px)]">
          <div
            className={cn(
              "-translate-x-1/2 relative left-1/2 w-full max-w-[768px] px-5",
              "max-[1372px]:left-0 max-[1372px]:translate-x-0"
            )}
          >
            <div className="overflow-hidden rounded-xl border bg-card shadow-lg">
              <AnimatedSizeContainer height>
                <div
                  className={cn(
                    "relative px-4 py-2.5 transition-[opacity,transform] duration-100",
                    isSelecting && "pointer-events-none absolute inset-0 translate-y-1/2 opacity-0"
                  )}
                >
                  <PaginationControls
                    pagination={pagination}
                    setPagination={setPagination}
                    totalCount={cardsCount}
                    unit={(plural) => `${plural ? "links" : "link"}`}
                  >
                    <Suspense>
                      <ArchivedLinksHint />
                    </Suspense>
                  </PaginationControls>
                  <div className="flex items-center gap-2 pt-3 sm:hidden">
                    <CreateButton hotkey="c" href="/cards/create" label="Create Card" />
                    <Button className="h-8 w-fit px-3.5" onClick={() => setIsSelectMode(true)} variant="secondary">
                      <CircleCheck className="size-4" />
                      Select
                    </Button>
                  </div>
                </div>
                <div
                  className={cn(
                    "relative px-4 py-3.5 transition-[opacity,transform] duration-100",
                    !isSelecting && "pointer-events-none absolute inset-0 translate-y-1/2 opacity-0"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setSelectedCardsId([]);
                          setIsSelectMode(false);
                        }}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <X className="size-4 text-neutral-900" />
                      </Button>
                      <span className="whitespace-nowrap font-medium text-neutral-600 text-sm">
                        <strong className="font-semibold">{selectedCardsId.length}</strong> selected
                      </span>
                    </div>

                    {/* Large screen controls */}
                    <div
                      className={cn(
                        "flex items-center gap-1.5 xs:gap-2 transition-[transform,opacity] duration-150",
                        selectedCardsId.length > 0
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-1/2 opacity-0"
                      )}
                    >
                      Bulk Actions
                      {bulkActions.map(({ label, icon: Icon, action }) => (
                        <Button
                          className="h-7 gap-1.5 px-2 xs:px-2.5 text-xs min-[1120px]:pr-1.5"
                          key={label}
                          onClick={action}
                          type="button"
                          variant="secondary"
                        >
                          <Icon className="size-3.5" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSizeContainer>
            </div>
          </div>
        </div>
      </>
    );
  }
);
