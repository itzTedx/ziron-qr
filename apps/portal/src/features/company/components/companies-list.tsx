"use client";

import { memo, useCallback } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { IconPlus } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

import { Button } from "@ziron/ui/components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ziron/ui/components/collapsible";
import { Skeleton } from "@ziron/ui/components/skeleton";
import { useHotkey } from "@ziron/ui/hooks/use-hotkey";

import { CompanyWithCards } from "@ziron/db/schema";
import { cn } from "@ziron/utils";

import { PersonCard } from "@/features/card/components/card-item";
import { orpc } from "@/lib/orpc/client";

import { companyCollapsibleStateAtom } from "../atom";
import { EditCompanyButton } from "./edit-company-button";
import { EmptyCompany } from "./empty-company";

const COMPANY_COLLAPSIBLE_COOKIE_NAME = "company-collapsible-state";
const COMPANY_COLLAPSIBLE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const MemoizedCollapsible = memo(Collapsible);
const MemoizedCollapsibleTrigger = memo(CollapsibleTrigger);
const MemoizedCollapsibleContent = memo(CollapsibleContent);

interface CompanyItemProps {
  company: CompanyWithCards;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CompanyItem = memo(({ company, isOpen, onOpenChange }: CompanyItemProps) => {
  return (
    <MemoizedCollapsible className="w-full" onOpenChange={onOpenChange} open={isOpen}>
      <div className="flex w-full cursor-pointer items-center justify-between">
        <MemoizedCollapsibleTrigger className="flex w-full cursor-pointer items-center gap-3">
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
        </MemoizedCollapsibleTrigger>

        <div className="flex gap-2">
          <EditCompanyButton initialData={company} />
          <Button asChild size="icon" variant="outline">
            <Link href={`/card/new?companyId=${company.id}`}>
              <IconPlus className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <MemoizedCollapsibleContent
        className={cn("grid grid-cols-2 gap-2.5 pt-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4")}
      >
        {company.cards.length === 0 ? (
          <EmptyCompany id={company.id} />
        ) : (
          company.cards.map((card) => <PersonCard card={card} company={company} key={card.id} />)
        )}
      </MemoizedCollapsibleContent>
    </MemoizedCollapsible>
  );
});

CompanyItem.displayName = "CompanyItem";

export const CompaniesList = () => {
  const [collapsibleState, setCollapsibleState] = useAtom(companyCollapsibleStateAtom);
  const { data: companies, isLoading } = useSuspenseQuery(orpc.company.list.queryOptions());
  const router = useRouter();

  // Handle C keyboard shortcut
  useHotkey({
    combos: [{ key: "c" }],
    enabled: true,
    callback: () => {
      router.push("/card/new");
    },
    throttleMs: 300,
  });

  const handleOpenChange = useCallback(
    (companyId: string, open: boolean) => {
      // Use functional update to avoid depending on collapsibleState
      setCollapsibleState((prevState) => {
        const newState = {
          ...prevState,
          [companyId]: open,
        };

        // Set cookie asynchronously to avoid blocking DOM commit
        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(() => {
            const encodedValue = encodeURIComponent(JSON.stringify(newState));
            document.cookie = `${COMPANY_COLLAPSIBLE_COOKIE_NAME}=${encodedValue}; path=/; max-age=${COMPANY_COLLAPSIBLE_COOKIE_MAX_AGE}`;
          });
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            const encodedValue = encodeURIComponent(JSON.stringify(newState));
            document.cookie = `${COMPANY_COLLAPSIBLE_COOKIE_NAME}=${encodedValue}; path=/; max-age=${COMPANY_COLLAPSIBLE_COOKIE_MAX_AGE}`;
          }, 0);
        }

        return newState;
      });
    },
    [setCollapsibleState]
  );

  if (isLoading) return <Skeleton className="h-10 w-full" />;

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      {companies.map((company) => {
        const isOpen = collapsibleState[company.id] ?? false;
        return (
          <CompanyItem
            company={company}
            isOpen={isOpen}
            key={company.id}
            onOpenChange={(open) => handleOpenChange(company.id, open)}
          />
        );
      })}
    </div>
  );
};
