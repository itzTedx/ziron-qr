"use client";

import { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@ziron/ui/components/button";
import { Kbd } from "@ziron/ui/components/kbd";
import { useKeyboardShortcut } from "@ziron/ui/hooks";

export const CreateButton = ({ href, label, hotkey }: { href: Route; label: string; hotkey: string }) => {
  const router = useRouter();

  useKeyboardShortcut(
    hotkey,
    () => {
      router.push(href);
    },
    { priority: 5 }
  );

  return (
    <Button asChild className="sm:pr-2.5">
      <Link href={href}>
        {label}
        <Kbd className="uppercase">{hotkey}</Kbd>
      </Link>
    </Button>
  );
};
