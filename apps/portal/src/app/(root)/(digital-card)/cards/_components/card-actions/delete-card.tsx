"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { isDefinedError } from "@orpc/client";
import { IconBackspace } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { IconArrowMoveDownRight } from "@ziron/ui/assets/icons/arrows";
import { Avatar, AvatarFallback, AvatarImage } from "@ziron/ui/components/avatar";
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
import { DropdownMenuItem, DropdownMenuShortcut } from "@ziron/ui/components/dropdown-menu";
import { Kbd } from "@ziron/ui/components/kbd";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { useHotkey } from "@ziron/ui/hooks/use-hotkey";

import { env } from "@/lib/env/client";
import { orpc, queryClient } from "@/lib/orpc/client";

interface Props {
  cardId: string;
}

export const DeleteCard = ({ cardId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { data: card } = useSuspenseQuery(orpc.card.get.queryOptions({ input: { id: cardId } }));

  const deleteCard = useMutation(
    orpc.card.delete.mutationOptions({
      onSuccess: (data) => {
        toast.success("Card deleted successfully", {
          description: `Card: ${data.cardName} has been deleted`,
        });
        queryClient.invalidateQueries({
          queryKey: orpc.card.list.queryKey(),
        });
        setIsOpen(false);
        router.push("/");
      },

      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error("Failed to delete card", { description: `${error.message}, try again later!` });
          return;
        }
        toast.error("Failed to delete card, try again later!", {
          description: error.message,
        });
      },
    })
  );

  const deleteCardAction = async () => {
    deleteCard.mutate({ id: cardId });
  };

  useHotkey({
    combos: [{ key: "x" }],
    callback: () => setIsOpen(true),
  });

  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader className="border-b">
            <DialogTitle>Delete Card</DialogTitle>
            <DialogDescription className="sr-only">This action cannot be undone.</DialogDescription>
          </DialogHeader>

          <div className="p-4 text-sm md:p-6">
            <p>Are you sure you want to delete this card?</p>
            <p className="mt-4 leading-relaxed">
              <strong className="font-semibold">
                Deleting the card will permanently delete this digital card and all associated data, including contact
                information, links, media files, and analytics.
              </strong>
            </p>

            <div className="mt-4 rounded-[calc(var(--radius)+calc(var(--spacing)*1.5))] border bg-background/50 p-1">
              <div className="rounded-xl border bg-card px-4 py-3.5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={card?.image} />
                    <AvatarFallback>{card?.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">
                      {card?.company.name} / {card?.name}
                    </h2>
                    <span className="flex items-center gap-1">
                      <IconArrowMoveDownRight className="size-3 text-muted-foreground/60" />
                      <p className="truncate text-muted-foreground text-xs">
                        {env.NEXT_PUBLIC_CLIENT_URL.split("//").pop()}/{card?.slug}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-muted-foreground">This action cannot be undone - proceed with caution</p>
          </div>
          <DialogFooter className="border-t">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={deleteCard.isPending} onClick={deleteCardAction} variant="destructive">
              <LoadingSwap isLoading={deleteCard.isPending}>Delete Card</LoadingSwap>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DropdownMenuItem
        className="text-destructive focus:bg-destructive focus:text-destructive-foreground focus:**:[&_kbd]:bg-destructive-foreground/30 focus:**:[&_kbd]:text-destructive-foreground"
        onSelect={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        role="button"
      >
        <IconBackspace className="size-4" />
        <span>Delete</span>

        <DropdownMenuShortcut>
          <Kbd className="bg-destructive/20 text-destructive">X</Kbd>
        </DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  );
};
