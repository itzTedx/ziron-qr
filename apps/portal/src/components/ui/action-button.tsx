"use client";

import type { ComponentProps } from "react";
import { useTransition } from "react";

import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@ziron/ui/components/alert-dialog";
import { Button } from "@ziron/ui/components/button";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";

export function ActionButton({
	action,
	requireAreYouSure = false,
	areYouSureDescription = "This action cannot be undone.",
	actionButton = "Yes",
	...props
}: ComponentProps<typeof Button> & {
	action: () => Promise<{ error: boolean; message?: string }>;
	requireAreYouSure?: boolean;
	areYouSureDescription?: ComponentProps<typeof AlertDialogDescription>["children"];
	actionButton?: ComponentProps<typeof LoadingSwap>["children"];
}) {
	const [isLoading, startTransition] = useTransition();

	function performAction() {
		startTransition(async () => {
			const data = await action();
			if (data.error) toast.error(data.message ?? "Error");
		});
	}

	if (requireAreYouSure) {
		return (
			<AlertDialog open={isLoading ? true : undefined}>
				<AlertDialogTrigger asChild>
					<Button {...props} />
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>{areYouSureDescription}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction disabled={isLoading} onClick={performAction} variant={props.variant}>
							<LoadingSwap isLoading={isLoading}>{actionButton}</LoadingSwap>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}

	return (
		<Button
			{...props}
			disabled={props.disabled ?? isLoading}
			onClick={(e) => {
				performAction();
				props.onClick?.(e);
			}}
		>
			<LoadingSwap className="inline-flex items-center gap-2" isLoading={isLoading}>
				{props.children}
			</LoadingSwap>
		</Button>
	);
}
