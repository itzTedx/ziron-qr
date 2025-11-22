import Image from "next/image";
import Link from "next/link";

import { IconEdit } from "@tabler/icons-react";

import type { CardType } from "@ziron/db/schema";
import { Button } from "@ziron/ui/components/button";
import { Card, CardContent } from "@ziron/ui/components/card";

type PersonCardFields = Pick<CardType, "id" | "name" | "designation">;

interface PersonCardProps {
  card: PersonCardFields & Partial<Pick<CardType, "designation">>;
}

export const PersonCard = ({ card }: PersonCardProps) => {
  return (
    <Card className="relative overflow-hidden pt-10 md:pt-12">
      <CardContent className="flex flex-col items-center justify-between p-0">
        <Image
          alt="Cover Image"
          className="absolute top-0 h-24 w-full object-cover md:h-28"
          height={112}
          quality={70}
          src={"/images/placeholder-cover.jpg"}
          width={260}
        />
        <div className="z-10 flex flex-col items-center pb-3 text-center">
          <Image
            alt={`${card.name}'s Photo`}
            className="size-24 rounded-full border-4 border-background object-cover md:size-28"
            height={112}
            src={"/images/placeholder-cover.jpg"}
            title={`${card.name}'s Photo`}
            width={112}
          />
          <h3 className="mt-2 font-semibold">{card.name}</h3>
          <p className="text-muted-foreground text-sm">{card.designation}</p>
        </div>
        <div className="flex w-full gap-2 border-t p-2">
          <Button asChild className="w-full gap-1.5 text-sm" variant="ghost">
            <Link href={`card/${card.id}`}>
              <IconEdit className="size-4" />
              <span className="hidden sm:block">Edit</span>
            </Link>
          </Button>

          {/* <ShareButton
              data={{
                url: person.slug!,
                name: person.name,
                logo: person.company.logo,
              }}
            /> */}
        </div>
      </CardContent>
    </Card>
  );
};
