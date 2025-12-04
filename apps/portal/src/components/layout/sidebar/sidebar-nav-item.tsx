"use client";

import { useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowUpRight, ChevronDown } from "lucide-react";

import { AnimatedSizeContainer } from "@ziron/ui/components/animated-size-container";

import { cn } from "@ziron/utils";

import { NavItemType, NavSubItemType } from "./types";

export function SidebarNavItem({ item }: { item: NavItemType | NavSubItemType }) {
  const { name, href, exact } = item;

  const Icon = "icon" in item ? item.icon : undefined;
  const items = "items" in item ? item.items : undefined;

  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const isActive = useMemo(() => {
    const hrefWithoutQuery = href.split("?")[0];
    return exact ? pathname === hrefWithoutQuery : pathname.startsWith(hrefWithoutQuery ?? "");
  }, [pathname, href, exact]);

  return (
    <div>
      <Link
        className={cn(
          "group flex h-8 items-center justify-between rounded-lg p-2 text-content-default text-sm leading-none transition-[background-color,color,font-weight] duration-75",
          "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
          isActive && !items
            ? "bg-background font-medium text-brand-secondary active:bg-brand-secondary/30"
            : "hover:bg-faded active:bg-faded"
        )}
        data-active={isActive}
        href={href}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <span className="flex items-center gap-2.5">
          {Icon && (
            <Icon
              className={cn("size-4", !items && "group-data-[active=true]:text-brand-secondary")}
              data-hovered={hovered}
            />
          )}
          {name}
        </span>
        <span className="ml-2 flex items-center gap-2">
          {items && (
            <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-75 group-data-[active=true]:rotate-180" />
          )}
          {item.arrow && (
            <ArrowUpRight className="group-hover:-translate-y-px size-3.5 text-content-default transition-transform duration-75 group-hover:translate-x-px" />
          )}
        </span>
      </Link>
      {items && (
        <AnimatedSizeContainer height transition={{ duration: 0.2, ease: "easeInOut" }}>
          <div
            aria-hidden={!isActive}
            className={cn("transition-opacity duration-200", isActive ? "h-auto" : "h-0 opacity-0")}
          >
            <div className="pt-1 pl-3.5">
              <div className="flex flex-col gap-0.5 border-l pl-2">
                {items.map((item) => (
                  <SidebarNavItem item={item} key={item.name} />
                ))}
              </div>
            </div>
          </div>
        </AnimatedSizeContainer>
      )}
    </div>
  );
}
