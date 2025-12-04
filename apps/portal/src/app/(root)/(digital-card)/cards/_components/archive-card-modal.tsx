"use client";

import { Dispatch, MouseEvent, SetStateAction, useCallback, useMemo, useState } from "react";

import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
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

  const archiveCard = useMutation(orpc.card.archive.mutationOptions());

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
      if (isDefinedError(error)) {
        toast.error(error.message);
      } else {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to ${actionText} cards. ${errorMessage}`);
      }
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

      <div className="bg-neutral-50 p-4 sm:p-6">
        <p className="text-neutral-800 text-sm">
          Are you sure you want to {actionText} the following {pluralize("card", cards.length)}?
        </p>

        <div className="scrollbar-hide mt-4 flex max-h-[190px] flex-col gap-2 overflow-y-auto rounded-2xl border border-neutral-200 p-2">
          {cards.map((card) => (
            <SimpleCardCard card={card} key={card.id} />
          ))}
        </div>
      </div>

      <DialogFooter className="border-neutral-200 border-t bg-neutral-50 px-4 py-5 sm:px-6">
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

export function useArchiveCardModal({ props }: { props: CardType | CardType[] }) {
  const [showArchiveCardModal, setShowArchiveCardModal] = useState(false);

  const ArchiveCardModalCallback = useCallback(() => {
    return props ? (
      <ArchiveCardModal
        cards={Array.isArray(props) ? props : [props]}
        setShowArchiveCardModal={setShowArchiveCardModal}
        showArchiveCardModal={showArchiveCardModal}
      />
    ) : null;
  }, [showArchiveCardModal, props]);

  return useMemo(
    () => ({
      setShowArchiveCardModal,
      ArchiveCardModal: ArchiveCardModalCallback,
    }),
    [ArchiveCardModalCallback]
  );
}
