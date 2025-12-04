"use client";

import { IconArchive } from "@tabler/icons-react";

import { DropdownMenuItem, DropdownMenuShortcut } from "@ziron/ui/components/dropdown-menu";
import { Kbd } from "@ziron/ui/components/kbd";
import { useKeyboardShortcut } from "@ziron/ui/hooks";

import { useArchiveCardModal } from "../archive-card-modal";

interface Props {
  cardId: string;
}

export const ArchiveCard = ({ cardId }: Props) => {
  const { setShowArchiveCardModal, ArchiveCardModal } = useArchiveCardModal({
    cardId,
  });

  useKeyboardShortcut("a", () => setShowArchiveCardModal(true), { priority: 3 });

  return (
    <>
      <ArchiveCardModal />
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setShowArchiveCardModal(true);
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
