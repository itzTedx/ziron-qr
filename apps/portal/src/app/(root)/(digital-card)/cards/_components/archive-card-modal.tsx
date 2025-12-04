"use client";

import { Dispatch, MouseEvent, SetStateAction, useCallback, useMemo, useState } from "react";

import { isDefinedError } from "@orpc/client";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ziron/ui/components/dialog";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";

import { CardType } from "@ziron/db/schema";
import { pluralize } from "@ziron/utils";

import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/orpc/query/hydration";

import { SimpleCardCard } from "./simple-card-card";

type ArchiveCardModalProps = {
  showArchiveCardModal: boolean;
  setShowArchiveCardModal: Dispatch<SetStateAction<boolean>>;
  cards: CardType[];
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ArchiveCardModal(props: ArchiveCardModalProps) {
  return (
    <Dialog onOpenChange={props.setShowArchiveCardModal} open={props.showArchiveCardModal}>
      <DialogContent className="p-0 sm:max-w-xl">
        <ArchiveCardModalInner {...props} />
      </DialogContent>
    </Dialog>
  );
}

function ArchiveCardModalInner({ setShowArchiveCardModal, cards }: ArchiveCardModalProps) {
  const archived = cards.every((card) => card.archivedAt);
  const actionText = archived ? "unarchive" : "archive";
  const queryClient = getQueryClient();
  const [archiving, setArchiving] = useState(false);

  const archiveCard = useMutation(
    orpc.card.archive.mutationOptions({
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
        } else {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          toast.error(`Failed to ${actionText} cards. ${errorMessage}`);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.card.list.queryKey(),
        });
        setShowArchiveCardModal(false);
        toast.success(`Successfully ${actionText}d ${pluralize("card", cards.length)}!`, {
          duration: 5000,
        });
      },
    })
  );

  const handleArchiveRequest = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setArchiving(true);

    try {
      // The archive endpoint now handles both archive and unarchive
      await Promise.all(cards.map((card) => archiveCard.mutateAsync({ id: card.id })));

      queryClient.invalidateQueries({
        queryKey: orpc.card.list.queryKey(),
      });

      setShowArchiveCardModal(false);
      toast.success(`Successfully ${actionText}d ${pluralize("card", cards.length)}!`, {
        duration: 5000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to ${actionText} cards. ${errorMessage}`);
    } finally {
      setArchiving(false);
    }
  };

  return (
    <>
      <div className="space-y-2 border-neutral-200 border-b p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-medium text-lg leading-none">
            {capitalize(actionText)} {cards.length > 1 ? `${cards.length} cards` : "card"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Are you sure you want to {actionText} the following {pluralize("card", cards.length)}?
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="bg-card p-4 text-sm sm:p-6">
        <p className="text-foreground/80">
          Are you sure you want to {actionText} the following {pluralize("card", cards.length)}?
        </p>
        <p className="mt-4 leading-relaxed">
          <strong className="font-semibold">
            Archiving the card will hide it from the public and all associated data, including contact information,
            links, media files, and analytics.
          </strong>
        </p>

        <div className="scrollbar-hide mt-4 flex max-h-[190px] flex-col gap-2 overflow-y-auto rounded-2xl border p-2">
          {cards.map((card) => (
            <SimpleCardCard card={card} key={card.id} />
          ))}
        </div>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          This action can be undone by {actionText} the {pluralize("card", cards.length)}.
        </p>
      </div>

      <DialogFooter className="border-t bg-card px-4 py-5 sm:px-6">
        <DialogClose asChild>
          <Button className="h-8 w-fit px-3" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <Button autoFocus className="h-8 w-fit px-3" disabled={archiving} onClick={handleArchiveRequest}>
          <LoadingSwap isLoading={archiving}>
            {capitalize(actionText)} {pluralize("card", cards.length)}
          </LoadingSwap>
        </Button>
      </DialogFooter>
    </>
  );
}

export function useArchiveCardModal({
  cardId,
  cardIds,
  cards: providedCards,
}: {
  cardId?: string;
  cardIds?: string[];
  cards?: CardType[];
}) {
  const [showArchiveCardModal, setShowArchiveCardModal] = useState(false);

  // Fetch single card if cardId is provided (and cards/cardIds are not)
  const singleCardQuery = useQuery({
    ...orpc.card.get.queryOptions({ input: { id: cardId ?? "" } }),
    enabled: !!cardId && !cardIds && !providedCards,
  });

  // Fetch multiple cards if cardIds is provided (and cards is not)
  const multipleCardsQueries = useQueries({
    queries: (cardIds ?? []).map((id) => orpc.card.get.queryOptions({ input: { id } })),
  });

  // Get cards data - prioritize provided cards, then fetched cards
  const cards = useMemo(() => {
    // If cards are provided directly, use them (for bulk actions)
    if (providedCards && providedCards.length > 0) {
      return providedCards;
    }
    // If cardIds are provided, fetch and return those
    if (cardIds && cardIds.length > 0) {
      return multipleCardsQueries.map((query) => query.data).filter((card): card is CardType => card !== undefined);
    }
    // If cardId is provided, fetch and return that single card
    if (cardId && singleCardQuery.data) {
      return [singleCardQuery.data];
    }
    return [];
  }, [providedCards, cardIds, cardId, singleCardQuery.data, multipleCardsQueries]);

  const ArchiveCardModalCallback = useCallback(() => {
    return cards.length > 0 ? (
      <ArchiveCardModal
        cards={cards}
        setShowArchiveCardModal={setShowArchiveCardModal}
        showArchiveCardModal={showArchiveCardModal}
      />
    ) : null;
  }, [showArchiveCardModal, cards]);

  return useMemo(
    () => ({
      setShowArchiveCardModal,
      ArchiveCardModal: ArchiveCardModalCallback,
    }),
    [ArchiveCardModalCallback]
  );
}
