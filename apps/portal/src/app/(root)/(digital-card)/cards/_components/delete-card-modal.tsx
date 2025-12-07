"use client";

import { Dispatch, MouseEvent, SetStateAction, useCallback, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

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

import { Card } from "@ziron/db/schema";
import { pluralize } from "@ziron/utils";

import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/orpc/query/hydration";

import { SimpleCardCard } from "./simple-card-card";

type DeleteCardModalProps = {
  showDeleteCardModal: boolean;
  setShowDeleteCardModalAction: Dispatch<SetStateAction<boolean>>;
  cards: Card[];
};

export function DeleteCardModal(props: DeleteCardModalProps) {
  return (
    <Dialog onOpenChange={props.setShowDeleteCardModalAction} open={props.showDeleteCardModal}>
      <DialogContent className="p-0 sm:max-w-xl">
        <DeleteCardModalInner {...props} />
      </DialogContent>
    </Dialog>
  );
}

function DeleteCardModalInner({ setShowDeleteCardModalAction: setShowDeleteCardModal, cards }: DeleteCardModalProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const queryClient = getQueryClient();

  const deleteCard = useMutation(
    orpc.card.delete.mutationOptions({
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
        } else {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          toast.error(`Failed to delete cards. ${errorMessage}`);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.card.list.queryKey(),
        });
        setShowDeleteCardModal(false);
        toast.success(`Successfully deleted ${pluralize("card", cards.length)}!`, {
          duration: 5000,
        });
      },
    })
  );

  const handleDeleteRequest = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setDeleting(true);

    try {
      await Promise.all(cards.map((card) => deleteCard.mutateAsync({ id: card.id })));

      queryClient.invalidateQueries({
        queryKey: orpc.card.list.queryKey(),
      });

      setShowDeleteCardModal(false);
      toast.success(`Successfully deleted ${pluralize("card", cards.length)}!`, {
        duration: 5000,
      });

      // Navigate to home page after deleting a single card (from card detail page)
      if (cards.length === 1) {
        router.push("/");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete cards. ${errorMessage}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-2 border-neutral-200 border-b p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-medium text-lg leading-none">
            Delete {cards.length > 1 ? `${cards.length} cards` : "card"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Are you sure you want to delete the following {pluralize("card", cards.length)}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="bg-neutral-50 p-4 sm:p-6">
        <p className="text-neutral-800 text-sm">
          Are you sure you want to delete the following {pluralize("card", cards.length)}?
        </p>
        <p className="mt-2 font-semibold text-neutral-900 text-sm">
          Deleting {cards.length > 1 ? "these cards" : "this card"} will permanently delete{" "}
          {cards.length > 1 ? "them" : "it"} and all associated data, including contact information, links, media files,
          and analytics.
        </p>

        <div className="scrollbar-hide mt-4 flex max-h-[190px] flex-col gap-2 overflow-y-auto rounded-2xl border border-neutral-200 p-2">
          {cards.map((card) => (
            <SimpleCardCard card={card} key={card.id} />
          ))}
        </div>

        <p className="mt-4 text-muted-foreground text-sm">This action cannot be undone - proceed with caution</p>
      </div>

      <DialogFooter className="border-neutral-200 border-t bg-neutral-50 px-4 py-5 sm:px-6">
        <DialogClose asChild>
          <Button className="h-8 w-fit px-3" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <Button
          autoFocus
          className="h-8 w-fit px-3"
          disabled={deleting}
          onClick={handleDeleteRequest}
          variant="destructive"
        >
          <LoadingSwap isLoading={deleting}>Delete {pluralize("card", cards.length)}</LoadingSwap>
        </Button>
      </DialogFooter>
    </>
  );
}

export function useDeleteCardModal({
  cardId,
  cardIds,
  cards: providedCards,
}: {
  cardId?: string;
  cardIds?: string[];
  cards?: Card[];
}) {
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);

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
      return multipleCardsQueries
        .map((query) => query.data)
        .filter((card): card is Card => card !== undefined && card.id !== undefined) as Card[];
    }
    // If cardId is provided, fetch and return that single card
    if (cardId && singleCardQuery.data) {
      return [singleCardQuery.data as Card];
    }
    return [];
  }, [providedCards, cardIds, cardId, singleCardQuery.data, multipleCardsQueries]);

  const DeleteCardModalCallback = useCallback(() => {
    return cards.length > 0 ? (
      <DeleteCardModal
        cards={cards}
        setShowDeleteCardModalAction={setShowDeleteCardModal}
        showDeleteCardModal={showDeleteCardModal}
      />
    ) : null;
  }, [showDeleteCardModal, cards]);

  return useMemo(
    () => ({
      setShowDeleteCardModal,
      DeleteCardModal: DeleteCardModalCallback,
    }),
    [DeleteCardModalCallback]
  );
}
