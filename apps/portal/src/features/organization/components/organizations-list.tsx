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

import { OrganizationWithCards } from "@ziron/db/schema";
import { cn } from "@ziron/utils";

import { PersonCard } from "@/features/card/components/person-card";
import { orpc } from "@/lib/orpc/client";

import { EmptyCard } from "../../card/components/empty-card";
import { companyCollapsibleStateAtom } from "../atom";
import { EditOrganizationButton } from "./edit-organization-button";

const ORGANIZATION_COLLAPSIBLE_COOKIE_NAME = "organization-collapsible-state";
const ORGANIZATION_COLLAPSIBLE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const MemoizedCollapsible = memo(Collapsible);
const MemoizedCollapsibleTrigger = memo(CollapsibleTrigger);
const MemoizedCollapsibleContent = memo(CollapsibleContent);

interface OrganizationItemProps {
  organization: OrganizationWithCards;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrganizationItem = memo(({ organization, isOpen, onOpenChange }: OrganizationItemProps) => {
  return (
    <MemoizedCollapsible className="w-full" onOpenChange={onOpenChange} open={isOpen}>
      <div className="flex w-full cursor-pointer items-center justify-between">
        <MemoizedCollapsibleTrigger className="flex w-full cursor-pointer items-center gap-3">
          {organization.logo && (
            <div className="flex size-8 items-center justify-center rounded-sm border bg-white p-1">
              <Image
                alt={`${organization.name}'s Logo`}
                className="size-4 object-contain"
                height={35}
                src={organization.logo}
                title={`${organization.name}'s Logo`}
                width={35}
              />
            </div>
          )}
          <h2 className="font-medium capitalize">{organization.name}</h2>
        </MemoizedCollapsibleTrigger>

        <div className="flex gap-2">
          <EditOrganizationButton initialData={organization} />
          <Button asChild size="icon" variant="outline">
            <Link href={`/card/new?organizationId=${organization.id}`}>
              <IconPlus className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <MemoizedCollapsibleContent
        className={cn("grid grid-cols-2 gap-2.5 pt-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4")}
      >
        {organization.cards.length === 0 ? (
          <EmptyCard id={organization.id} />
        ) : (
          organization.cards.map((card) => <PersonCard card={card} key={card.id} organization={organization} />)
        )}
      </MemoizedCollapsibleContent>
    </MemoizedCollapsible>
  );
});

OrganizationItem.displayName = "OrganizationItem";

export const OrganizationsList = () => {
  const [collapsibleState, setCollapsibleState] = useAtom(companyCollapsibleStateAtom);
  const { data: organizations, isLoading } = useSuspenseQuery(orpc.organization.list.queryOptions());
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
    (organizationId: string, open: boolean) => {
      // Use functional update to avoid depending on collapsibleState
      setCollapsibleState((prevState) => {
        const newState = {
          ...prevState,
          [organizationId]: open,
        };

        // Set cookie asynchronously to avoid blocking DOM commit
        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(() => {
            const encodedValue = encodeURIComponent(JSON.stringify(newState));
            document.cookie = `${ORGANIZATION_COLLAPSIBLE_COOKIE_NAME}=${encodedValue}; path=/; max-age=${ORGANIZATION_COLLAPSIBLE_COOKIE_MAX_AGE}`;
          });
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            const encodedValue = encodeURIComponent(JSON.stringify(newState));
            document.cookie = `${ORGANIZATION_COLLAPSIBLE_COOKIE_NAME}=${encodedValue}; path=/; max-age=${ORGANIZATION_COLLAPSIBLE_COOKIE_MAX_AGE}`;
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
      {organizations.map((organization) => {
        const isOpen = collapsibleState[organization.id] ?? false;
        return (
          <OrganizationItem
            isOpen={isOpen}
            key={organization.id}
            onOpenChange={(open) => handleOpenChange(organization.id, open)}
            organization={organization}
          />
        );
      })}
    </div>
  );
};
