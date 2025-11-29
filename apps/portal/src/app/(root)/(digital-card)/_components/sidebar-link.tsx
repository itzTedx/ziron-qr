"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@ziron/utils";

interface Props {
  href: string;
  children: React.ReactNode;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export function SidebarLinkItem({ href, children, icon: Icon }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      className={cn(
        "-m-px flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 hover:bg-muted/50",
        isActive && "border-brand-secondary/10 bg-brand-secondary/10 text-brand-secondary"
      )}
      href={href as Route}
    >
      <Icon className="size-4" />
      <span className="text-sm">{children}</span>
    </Link>
  );
}
