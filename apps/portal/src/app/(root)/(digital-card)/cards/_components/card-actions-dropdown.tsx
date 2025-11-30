"use client";

import { useEffect } from "react";

import { IconDotsVertical } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ziron/ui/components/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";

import { ArchiveCard } from "./card-actions/archive-card";
import { CopyCardId } from "./card-actions/copy-card-id";
import { DeleteCard } from "./card-actions/delete-card";
import { DuplicateCard } from "./card-actions/duplicate-card";

interface Props {
  cardId: string;
}

export const CardActionsDropdown = ({ cardId }: Props) => {
  console.log("cardId", cardId);

  useEffect(() => {
    console.log("cardId Rendered", cardId);
  }, [cardId]);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="outline">
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Card Actions</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="min-w-48 font-medium">
        <DropdownMenuGroup>
          <CopyCardId cardId={cardId} />
          <DuplicateCard cardId={cardId} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ArchiveCard cardId={cardId} />

          <DeleteCard cardId={cardId} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
