"use client";

import { IconShare } from "@tabler/icons-react";
import { useSetAtom } from "jotai";

import { Button } from "@ziron/ui/components/button";

import { CardType, Organization } from "@ziron/db/schema";

import { openShareModalAtom, type ShareModalData } from "@/features/organization/atom";
import { env } from "@/lib/env/client";

type PersonCardFields = Pick<CardType, "id" | "name" | "designation" | "slug" | "image" | "cover">;
interface ShareButtonProps {
  data: PersonCardFields;
  organization: Organization;
}

export default function ShareButton({ data, organization }: ShareButtonProps) {
  const shareLink = `${env.NEXT_PUBLIC_CLIENT_URL}/${data.slug}`;

  const shareData: ShareModalData = {
    data: {
      ...data,
      organization: {
        logo: organization.logo ?? null,
        name: organization.name,
      },
      url: shareLink,
    },
  };

  const openModal = useSetAtom(openShareModalAtom);

  return (
    <Button className="w-full flex-1 gap-1.5" onClick={() => openModal(shareData)} size="sm" variant="ghost">
      <IconShare className="size-3.5 sm:size-4" /> <span className="text-xs sm:text-sm">Share</span>
    </Button>
  );
}
