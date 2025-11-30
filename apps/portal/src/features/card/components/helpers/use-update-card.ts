import { useRouter } from "next/navigation";

import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { zCardSchema } from "@ziron/validators";

import { orpc, queryClient } from "@/lib/orpc/client";

// Separate hook for update mutation (only used in edit mode)
export function useUpdateCard(form: ReturnType<typeof useForm<zCardSchema>>) {
  const router = useRouter();

  return useMutation(
    orpc.card.update.mutationOptions({
      onSuccess: (updatedCard) => {
        toast.success(`Card: ${updatedCard.cardName} has been updated`);
        form.reset(form.getValues(), { keepDefaultValues: true });
        queryClient.invalidateQueries({
          queryKey: orpc.card.list.queryKey(),
        });
        router.push("/cards");
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          if (error.code === "NOT_FOUND") {
            toast.error("Card not found", { description: error.message });
            return;
          }
          toast.error("Failed to update card, try again later!", { description: error.message });
          return;
        }
        toast.error(error.message);
      },
    })
  );
}
