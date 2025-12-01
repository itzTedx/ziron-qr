"use client";

import { useRouter } from "next/navigation";

import { isDefinedError } from "@orpc/client";
import { IconCopyPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { DropdownMenuItem, DropdownMenuShortcut } from "@ziron/ui/components/dropdown-menu";
import { Kbd } from "@ziron/ui/components/kbd";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { useKeyboardShortcut } from "@ziron/ui/hooks";

import { orpc, queryClient } from "@/lib/orpc/client";

interface Props {
  cardId: string;
}

export const DuplicateCard = ({ cardId }: Props) => {
  const router = useRouter();

  const duplicateCard = useMutation(
    orpc.card.duplicate.mutationOptions({
      onSuccess: (data) => {
        toast.success("Card duplicated successfully", {
          description: `Card: ${data.cardName} has been duplicated`,
        });
        queryClient.invalidateQueries({
          queryKey: orpc.card.list.queryKey(),
        });
        router.push(`/cards/${data.cardId}`);
      },

      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error("Failed to duplicate card", { description: `${error.message}, try again later!` });
          return;
        }
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error("Failed to duplicate card, try again later!", {
          description: errorMessage,
        });
      },
    })
  );

  const handleDuplicate = () => {
    duplicateCard.mutate({ id: cardId });
  };

  useKeyboardShortcut("d", handleDuplicate, { priority: 3 });
  return (
    <DropdownMenuItem
      disabled={duplicateCard.isPending}
      onSelect={(e) => {
        e.preventDefault();
        handleDuplicate();
      }}
      role="button"
    >
      <LoadingSwap isLoading={duplicateCard.isPending}>
        <IconCopyPlus className="size-4" />
      </LoadingSwap>
      <span>Duplicate Card</span>

      <DropdownMenuShortcut>
        <Kbd>D</Kbd>
      </DropdownMenuShortcut>
    </DropdownMenuItem>
  );
};
