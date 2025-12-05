"use client";

import { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <Button asChild className={cn("sm:pr-2.5", className)}>
      <Link href={href}>
        {label}
        <Kbd className="text-white uppercase">{hotkey}</Kbd>
      </Link>
    </Button>
  );
};
