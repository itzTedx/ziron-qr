"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation";

import { Kbd } from "@ziron/ui/components/kbd";
import { useHotkey } from "@ziron/ui/hooks/use-hotkey";

import { cn } from "@ziron/utils";

interface Props {
  href: Route;
  children: React.ReactNode;
  icon: React.ReactNode;
  shortcut?: string;
  className?: string;
}

export function SidebarLinkItem({ href, children, icon, shortcut, className }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const isActive = segment ? href.toString().includes(segment) : pathname === href;

  useHotkey({
    enabled: !!shortcut,
    combos: [{ key: shortcut?.toLowerCase() ?? "" }],
    callback: () => {
      router.push(href);
    },
  });

  return (
    <Link className={cn(className)} data-active={isActive} href={href}>
      {icon}
      <span className="grow text-sm">{children}</span>
      {shortcut && (
        <Kbd className="uppercase" size="sm" variant="outline">
          {shortcut}
        </Kbd>
      )}
    </Link>
  );
}
