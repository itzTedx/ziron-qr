"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";

import { DropdownMenuItem, DropdownMenuShortcut } from "@ziron/ui/components/dropdown-menu";
import { Kbd } from "@ziron/ui/components/kbd";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { useCopyToClipboard, useKeyboardShortcut } from "@ziron/ui/hooks";

interface Props {
	cardId: string;
}

export const CopyCardId = ({ cardId }: Props) => {
	const { isCopied, copyToClipboard } = useCopyToClipboard({
		customToast: {
			description: "Card ID copied to clipboard",
		},
	});

	function handleCopyCardId() {
		copyToClipboard(cardId);
	}

	useKeyboardShortcut("i", handleCopyCardId, { priority: 4 });

	return (
		<DropdownMenuItem
			disabled={isCopied}
			onSelect={(e) => {
				e.preventDefault();
				handleCopyCardId();
			}}
			role="button"
		>
			<LoadingSwap icon={<IconCheck className="size-4" />} isLoading={isCopied}>
				<IconCopy className="size-4" />
			</LoadingSwap>
			<span>Copy Card ID</span>

			<DropdownMenuShortcut>
				<Kbd>I</Kbd>
			</DropdownMenuShortcut>
		</DropdownMenuItem>
	);
};
