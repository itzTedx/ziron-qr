"use client";

import { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@ziron/ui/components/button";
import { Kbd } from "@ziron/ui/components/kbd";
import { useHotkey } from "@ziron/ui/hooks/use-hotkey";

export const CreateButton = ({ href, label }: { href: Route; label: string }) => {
  const router = useRouter();

  useHotkey({
    combos: [{ key: "c" }],
    callback: () => {
      router.push(href);
    },
  });

  return (
    <Button asChild className="pr-2.5">
      <Link href={href}>
        {label}
        <Kbd className="text-card">C</Kbd>
      </Link>
    </Button>
  );
};
