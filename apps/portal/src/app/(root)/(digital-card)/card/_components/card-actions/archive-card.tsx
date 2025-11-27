"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { isDefinedError } from "@orpc/client";
import { IconArchive } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { IconArrowMoveDownRight } from "@ziron/ui/assets/icons/arrows";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ziron/ui/components/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@ziron/ui/components/avatar";
import { DropdownMenuItem, DropdownMenuShortcut } from "@ziron/ui/components/dropdown-menu";
import { Kbd } from "@ziron/ui/components/kbd";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { useHotkey } from "@ziron/ui/hooks/use-hotkey";

import { env } from "@/lib/env/client";
import { orpc, queryClient } from "@/lib/orpc/client";

interface Props {
  cardId: string;
}

export const ArchiveCard = ({ cardId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: card } = useSuspenseQuery(orpc.card.get.queryOptions({ input: { id: cardId } }));

  const archiveCard = useMutation(
    orpc.card.archive.mutationOptions({
      onSuccess: (data) => {
        toast.success("Card archived successfully", {
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
          toast.error("Failed to archive card", { description: `${error.message}, try again later!` });
          return;
        }
        toast.error("Failed to archive card, try again later!", {
          description: error.message,
        });
      },
    })
  );

  const handleArchiveCard = () => {
    archiveCard.mutate({ id: cardId });
  };

  useHotkey({
    combos: [{ key: "a" }],
    callback: () => setIsOpen(true),
  });

  return (
    <>
      <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="border-b">
            <AlertDialogTitle>Archive Card</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">This action can be undone.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="p-4 text-sm md:p-6">
            <p>Are you sure you want to archive this card?</p>
            <p className="mt-4 leading-relaxed">
              <strong className="font-semibold">
                Archiving the card will hide it from the public and all associated data, including contact information,
                links, media files, and analytics.
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
            <p className="mt-4 text-muted-foreground leading-relaxed">
              This action can be undone by unarchiving the card.
            </p>
          </div>
          <AlertDialogFooter className="border-t">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={archiveCard.isPending} onClick={handleArchiveCard} variant="destructive">
              <LoadingSwap isLoading={archiveCard.isPending}>Archive Card</LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        role="button"
      >
        <IconArchive className="size-4" />
        <span>Archive</span>

        <DropdownMenuShortcut>
          <Kbd>A</Kbd>
        </DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  );
};
