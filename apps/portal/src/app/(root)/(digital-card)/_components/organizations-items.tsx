"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { EmptyCard } from "@/features/card/components/empty-card";
import { PersonCard } from "@/features/card/components/person-card";
import { orpc } from "@/lib/orpc/client";

export const CardsItems = () => {
  const { data: cards, isError } = useSuspenseQuery(orpc.card.list.queryOptions());

  if (isError) {
    return <div>Error loading cards</div>;
  }

  if (cards.length === 0) {
    return <EmptyCard />;
  }

  return (
    <div>
      {cards.map((card) => (
        <PersonCard card={card} key={card.id} organization={card.organization} />
      ))}
    </div>
  );
};
