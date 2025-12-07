"use client";

import { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { IconPlus } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import { Kbd } from "@ziron/ui/components/kbd";
import { useKeyboardShortcut } from "@ziron/ui/hooks";

import { cn } from "@ziron/utils";

interface CreateButtonProps {
  href: Route;
  label: string;
  hotkey: string;
  className?: string;
}

export const CreateButton = ({ href, label, hotkey, className }: CreateButtonProps) => {
  const router = useRouter();

  useKeyboardShortcut(
    hotkey,
    () => {
      router.push(href);
    },
    { priority: 5 }
  );

  return (
    <Button asChild className={cn("group sm:pl-2.5", className)} variant="primary">
      <Link href={href}>
        <Kbd className="text-white uppercase">
          <span className="opacity-0 transition-opacity duration-150 ease-tact-in group-hover:opacity-100">
            {hotkey}
          </span>
          <span className="absolute transition-opacity duration-150 ease-tact-in group-hover:opacity-0">
            <IconPlus className="size-3 stroke-3" />
          </span>
        </Kbd>
        {label}
      </Link>
    </Button>
  );
};
