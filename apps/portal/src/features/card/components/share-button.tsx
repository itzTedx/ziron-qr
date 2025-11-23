"use client";

import { IconShare } from "@tabler/icons-react";
import { useSetAtom } from "jotai";

import { Button } from "@ziron/ui/components/button";

import { openShareModalAtom } from "@/features/company/atom";

interface ShareButtonProps {
  data: {
    url: string;
    name: string;
    logo: string | null; // Ensure logo can be null
  };
}

export default function ShareButton({ data }: ShareButtonProps) {
  const shareLink = `${process.env.NEXT_PUBLIC_BASE_PATH}/${data.url}`;

  const shareData = {
    url: shareLink,
    name: data.name,
    logo: data.logo || undefined,
  };

  const openModal = useSetAtom(openShareModalAtom);

  return (
    <Button className="w-full flex-1 gap-1.5 text-sm" onClick={() => openModal(shareData)} variant="ghost">
      <IconShare className="size-4" /> <span className="hidden sm:block">Share</span>
    </Button>
  );
}
