"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

import { cn } from "@ziron/utils";

interface Props {
  href: Route;
  children: React.ReactNode;
  icon: React.ReactNode;
}

export function SidebarLinkItem({ href, children, icon }: Props) {
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();

  const isActive = segment ? href.toString().includes(segment) : pathname === href;

  return (
    <Link
      className={cn(
        "flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 transition-colors duration-1000 hover:bg-muted/50 data-[active=true]:border-brand-secondary/5 data-[active=true]:bg-brand-secondary/10 data-[active=true]:font-medium data-[active=true]:text-brand-secondary"
      )}
      data-active={isActive}
      href={href}
    >
      {icon}
      <span className="text-sm">{children}</span>
    </Link>
  );
}
