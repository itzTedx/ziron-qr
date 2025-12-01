"use client";

import { memo, Suspense, useState } from "react";

import { CircleCheck, X } from "lucide-react";

import { AnimatedSizeContainer } from "@ziron/ui/components/animated-size-container";
import { Button } from "@ziron/ui/components/button";
import { Spinner } from "@ziron/ui/components/spinner";
import { PaginationState } from "@ziron/ui/components/table";

import { CardType } from "@ziron/db/schema";
import { cn } from "@ziron/utils";

import { CreateButton } from "@/components/ui/create-button";

import ArchivedLinksHint from "./archived-links-hint";
import { PaginationControls } from "./pagination";

interface Props {
  isLoading: boolean;
  cards: CardType[];
  cardsCount: number;
  isSelectMode: boolean;
  setIsSelectMode: (isSelectMode: boolean) => void;
  selectedCardsId: string[];
  setSelectedCardsId: (selectedCardsId: string[]) => void;
}

export const CardsToolbar = memo(
  ({ isLoading, cards, cardsCount, isSelectMode, setIsSelectMode, selectedCardsId, setSelectedCardsId }: Props) => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 1,
      pageSize: 10,
    });
    const isSelecting = isSelectMode || selectedCardsId.length > 0;

    return (
      <>
        <div className="h-[120px]" />

        <div className="fixed bottom-3 left-0 z-10 w-full [--left:62px] sm:max-[1372px]:w-[calc(100%-150px)] md:left-(--left) md:w-[calc(100%-var(--left))] md:max-[1372px]:w-[calc(100%-var(--left)-150px)]">
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
                    {isLoading ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <div className="hidden sm:block">
                        <Suspense>
                          <ArchivedLinksHint />
                        </Suspense>
                      </div>
                    )}
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
                      <button
                        className="rounded-md p-1.5 transition-colors duration-75 hover:bg-neutral-50 active:bg-neutral-100"
                        onClick={() => {
                          setSelectedCardsId([]);
                          setIsSelectMode(false);
                        }}
                        type="button"
                      >
                        <X className="size-4 text-neutral-900" />
                      </button>
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
                      {/* {bulkActions.map(({ label, icon: Icon, action, disabledTooltip, keyboardShortcut }, idx) => (
                        <Button
                          className="h-7 gap-1.5 px-2 xs:px-2.5 text-xs min-[1120px]:pr-1.5"
                          disabledTooltip={
                            disabledTooltip ||
                            (!hasAllFolderPermissions ? "You don't have permission to perform this action." : undefined)
                          }
                          icon={<Icon className="size-3.5" />}
                          key={idx}
                          onClick={action}
                          shortcut={keyboardShortcut?.toUpperCase()}
                          shortcutClassName="py-px px-1 text-[0.625rem] leading-snug md:hidden min-[1120px]:inline-block"
                          text={label}
                          textWrapperClassName="max-[1120px]:hidden"
                          type="button"
                          variant="secondary"
                        />
                      ))} */}
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
