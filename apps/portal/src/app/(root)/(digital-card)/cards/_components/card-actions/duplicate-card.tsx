"use client";

import { useRouter } from "next/navigation";

import { IconCopyPlus } from "@tabler/icons-react";

import { DropdownMenuItem, DropdownMenuShortcut } from "@ziron/ui/components/dropdown-menu";
import { Kbd } from "@ziron/ui/components/kbd";
import { useKeyboardShortcut } from "@ziron/ui/hooks";

interface Props {
	cardId: string;
}

export const DuplicateCard = ({ cardId }: Props) => {
	const router = useRouter();

	const handleDuplicate = () => {
		router.push(`/cards/${cardId}/duplicate`);
	};

	useKeyboardShortcut("d", handleDuplicate, { priority: 3 });
	return (
		<DropdownMenuItem
			onSelect={(e) => {
				e.preventDefault();
				handleDuplicate();
			}}
			role="button"
		>
			<IconCopyPlus className="size-4" />

			<span>Duplicate Card</span>

			<DropdownMenuShortcut>
				<Kbd>D</Kbd>
			</DropdownMenuShortcut>
		</DropdownMenuItem>
	);
};
