import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { IconEdit } from "@tabler/icons-react";

import type { CardType, Company } from "@ziron/db/schema";
import { Button } from "@ziron/ui/components/button";
import { Card, CardContent, CardFooter } from "@ziron/ui/components/card";

import ShareButton from "./share-button";

type PersonCardFields = Pick<CardType, "id" | "name" | "designation" | "slug" | "image" | "cover">;

interface PersonCardProps {
  card: PersonCardFields;
  company: Company;
}

export const PersonCard = ({ card, company }: PersonCardProps) => {
  return (
    <Card className="relative overflow-hidden pt-10 md:pt-12">
      <CardContent className="flex flex-col items-center justify-between p-0">
        <Image
          alt="Cover Image"
          className="absolute top-0 h-24 w-full object-cover md:h-28"
          height={112}
          quality={70}
          src={card.cover ?? "/images/placeholder-cover.jpg"}
          width={260}
        />
        <div className="z-10 flex flex-col items-center pb-3 text-center">
          <Image
            alt={`${card.name}'s Photo`}
            className="size-24 rounded-full border-4 border-background object-cover md:size-28"
            height={112}
            src={card.image}
            title={`${card.name}'s Photo`}
            width={112}
          />
          <h3 className="mt-2 font-semibold">{card.name}</h3>
          <p className="text-muted-foreground text-sm">{card.designation}</p>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <Button asChild className="w-full flex-1 gap-1.5 text-sm" variant="ghost">
          <Link href={`card/${card.id}` as Route}>
            <IconEdit className="size-4" />
            <span className="hidden sm:block">Edit</span>
          </Link>
        </Button>

        <ShareButton company={company} data={card} />
      </CardFooter>
    </Card>
  );
};
