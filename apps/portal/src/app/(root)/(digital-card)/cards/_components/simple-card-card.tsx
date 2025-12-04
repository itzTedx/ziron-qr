"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@ziron/ui/components/avatar";

import { CardType } from "@ziron/db/schema";

import { env } from "@/lib/env/client";

interface SimpleCardCardProps {
  card: CardType;
}

export function SimpleCardCard({ card }: SimpleCardCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <Avatar className="size-10">
        <AvatarImage src={card.image} />
        <AvatarFallback>{card.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium">
          {card?.organization.name} / {card?.name}
        </h3>
        <p className="truncate text-muted-foreground text-xs">
          {env.NEXT_PUBLIC_CLIENT_URL.split("//").pop()}/{card?.slug}
        </p>
      </div>
    </div>
  );
}
