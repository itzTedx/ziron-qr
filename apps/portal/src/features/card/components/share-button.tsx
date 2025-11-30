"use client";

import { IconShare } from "@tabler/icons-react";
import { useSetAtom } from "jotai";

import { Button } from "@ziron/ui/components/button";

import { openShareModalAtom } from "@/features/organization/atom";

interface ShareButtonProps {
  cardId: string;
}

export default function ShareButton({ cardId }: ShareButtonProps) {
  const openModal = useSetAtom(openShareModalAtom);

  return (
    <Button className="w-full flex-1 gap-1.5" onClick={() => openModal({ cardId })} size="sm" variant="ghost">
      <IconShare className="size-3.5 sm:size-4" /> <span className="text-xs sm:text-sm">Share</span>
    </Button>
  );
}
