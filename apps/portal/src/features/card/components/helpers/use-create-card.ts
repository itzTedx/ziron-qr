import { useRouter } from "next/navigation";

import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { zCardSchema } from "@ziron/validators";

import { orpc, queryClient } from "@/lib/orpc/client";

// Separate hook for create mutation (static, no dependencies)
export function useCreateCard(form: ReturnType<typeof useForm<zCardSchema>>) {
	const router = useRouter();

	return useMutation(
		orpc.card.create.mutationOptions({
			onSuccess: (newCard) => {
				toast.success(`Card: ${newCard.cardName} has been Created`);
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
					toast.error("Failed to create card, try again later!", { description: error.message });
					return;
				}
				toast.error(error.message);
			},
		})
	);
}
