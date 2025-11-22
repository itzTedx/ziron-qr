"use client";

import Image from "next/image";
import Link from "next/link";

import { IconPlus } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

import { Button } from "@ziron/ui/components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ziron/ui/components/collapsible";
import { Skeleton } from "@ziron/ui/components/skeleton";
import { cn } from "@ziron/utils";

import { PersonCard } from "@/features/card/components/card-item";
import { orpc } from "@/lib/orpc/client";

import { companyCollapsibleStateAtom } from "../atom";
import { EditCompanyButton } from "./edit-company-button";
import { EmptyCompany } from "./empty-company";

export const CompaniesList = () => {
  const [collapsibleState, setCollapsibleState] = useAtom(companyCollapsibleStateAtom);
  const { data: companies, isLoading } = useSuspenseQuery(orpc.company.list.queryOptions());

  if (isLoading) return <Skeleton className="h-10 w-full" />;

  const handleOpenChange = (companyId: string, open: boolean) => {
    setCollapsibleState((prev) => ({
      ...prev,
      [companyId]: open,
    }));
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      {companies.map((company) => {
        const isOpen = collapsibleState[company.id] ?? false;
        return (
          <Collapsible
            className="w-full"
            key={company.id}
            onOpenChange={(open) => handleOpenChange(company.id, open)}
            open={isOpen}
          >
            <div className="flex w-full cursor-pointer items-center justify-between border-b pb-3">
              <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-3">
                {company.logo && (
                  <div className="flex size-8 items-center justify-center rounded-sm border bg-white p-1">
                    <Image
                      alt={`${company.name}'s Logo`}
                      className="size-4 object-contain"
                      height={35}
                      src={company.logo}
                      title={`${company.name}'s Logo`}
                      width={35}
                    />
                  </div>
                )}
                <h2 className="font-medium capitalize">{company.name}</h2>
              </CollapsibleTrigger>

              <div className="flex gap-2">
                <EditCompanyButton initialData={company} />
                <Button asChild size="icon" variant="outline">
                  <Link href={`/card/new?company=${company.id}`}>
                    <IconPlus className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <CollapsibleContent
              className={cn("grid grid-cols-2 gap-4 pt-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5")}
            >
              {company.cards.length === 0 ? (
                <EmptyCompany id={company.id} />
              ) : (
                company.cards.map((card) => <PersonCard card={card} key={card.id} />)
              )}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
