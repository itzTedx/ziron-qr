"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

import { Kbd } from "@ziron/ui/components/kbd";

import { cn } from "@ziron/utils";

interface Props {
  href: Route;
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}

export function SidebarLinkItem({ href, children, icon, className }: Props) {
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();

  const isActive = segment ? href.toString().includes(segment) : pathname === href;

  return (
    <Link className={cn(className)} data-active={isActive} href={href}>
      {icon}
      <span className="grow text-sm">{children}</span>
      <Kbd>C</Kbd>
    </Link>
  );
}
