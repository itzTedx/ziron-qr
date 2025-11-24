"use client";

import { IconShare } from "@tabler/icons-react";
import { useSetAtom } from "jotai";

import { CardType, Company } from "@ziron/db/schema";
import { Button } from "@ziron/ui/components/button";

import { openShareModalAtom, type ShareModalData } from "@/features/company/atom";
import { env } from "@/lib/env/client";

type PersonCardFields = Pick<CardType, "id" | "name" | "designation" | "slug" | "image">;
interface ShareButtonProps {
  data: PersonCardFields;
  company: Company;
}

export default function ShareButton({ data, company }: ShareButtonProps) {
  const shareLink = `${env.NEXT_PUBLIC_BASE_URL}/${data.slug}`;

  const shareData: ShareModalData = {
    data: {
      ...data,
      company: {
        logo: company.logo ?? null,
        name: company.name,
      },
      url: shareLink,
    },
  };

  const openModal = useSetAtom(openShareModalAtom);

  return (
    <Button className="w-full flex-1 gap-1.5 text-sm" onClick={() => openModal(shareData)} variant="ghost">
      <IconShare className="size-4" /> <span className="hidden sm:block">Share</span>
    </Button>
  );
}
