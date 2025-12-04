import { useRouter } from "next/navigation";

import { isDefinedError } from "@orpc/client";
import { IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { ActionButton } from "@/components/ui/action-button";

import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/orpc/query/hydration";

interface Props {
  id: string;
}

export const DeleteCard = ({ id }: Props) => {
  const router = useRouter();
  const queryClient = getQueryClient();
  const deleteCard = useMutation(
    orpc.card.delete.mutationOptions({
      onSuccess: (data) => {
        toast.success("Card deleted successfully", {
          description: `Card: ${data.cardName} has been deleted`,
        });
        queryClient.invalidateQueries({
          queryKey: orpc.card.list.queryKey(),
        });
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
    deleteCard.mutate({ id });
    return { error: deleteCard.isError };
  };

  return (
    <ActionButton
      action={deleteCardAction}
      actionButton="Delete"
      areYouSureDescription="This action cannot be undone."
      className="w-full"
      requireAreYouSure
      size="lg"
      variant="destructive"
    >
      <IconTrash className="size-4" />
      Delete
    </ActionButton>
  );
};
