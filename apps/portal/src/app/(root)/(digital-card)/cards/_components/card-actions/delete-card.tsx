"use client";

import { IconBackspace } from "@tabler/icons-react";

import { DropdownMenuItem, DropdownMenuShortcut } from "@ziron/ui/components/dropdown-menu";
import { Kbd } from "@ziron/ui/components/kbd";
import { useKeyboardShortcut } from "@ziron/ui/hooks";

import { useDeleteCardModal } from "../delete-card-modal";

interface Props {
  cardId: string;
}

export const DeleteCard = ({ cardId }: Props) => {
  const { setShowDeleteCardModal, DeleteCardModal } = useDeleteCardModal({
    cardId,
  });

  useKeyboardShortcut("x", () => setShowDeleteCardModal(true), { priority: 1 });

  return (
    <>
      <DeleteCardModal />
      <DropdownMenuItem
        className="text-destructive focus:bg-destructive focus:text-destructive-foreground focus:**:[&_kbd]:bg-destructive-foreground/30 focus:**:[&_kbd]:text-destructive-foreground"
        onSelect={(e) => {
          e.preventDefault();
          setShowDeleteCardModal(true);
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
