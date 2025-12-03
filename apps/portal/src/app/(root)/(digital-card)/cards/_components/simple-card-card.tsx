"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@ziron/ui/components/avatar";

import { CardType } from "@ziron/db/schema";

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
        <h3 className="truncate font-medium">{card.name}</h3>
        {card.organization && <p className="truncate text-muted-foreground text-xs">{card.organization.name}</p>}
      </div>
    </div>
  );
}
