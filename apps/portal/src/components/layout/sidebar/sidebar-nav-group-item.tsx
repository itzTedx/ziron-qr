"use client";

import { useState } from "react";

import Link from "next/link";

import { cn } from "@ziron/utils";

import { NavGroupTooltip } from "./sidebar-nav";
import { NavGroupType } from "./types";

export function NavGroupItem({
  group: { name, description, learnMoreHref, icon: Icon, href, active, badge, onClick, popup: Popup },
}: {
  group: NavGroupType;
}) {
  const [element, setElement] = useState<HTMLAnchorElement | null>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <NavGroupTooltip description={description} learnMoreHref={learnMoreHref} name={name}>
        <div>
          <Link
            className={cn(
              "relative flex size-11 items-center justify-center rounded-lg transition-colors duration-150 [corner-shape:squircle]",
              "outline-none focus-visible:ring-2 focus-visible:ring-card/50",
              active ? "bg-card" : "hover:bg-muted/5 active:bg-muted/10"
            )}
            href={href}
            onClick={onClick}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            ref={Popup ? setElement : undefined}
          >
            <Icon className="size-5 text-content-default" data-hovered={hovered} />
            {badge && (
              <div className="absolute top-0.5 right-0.5 flex size-3.5 items-center justify-center rounded-full bg-primary-600 font-semibold text-[0.625rem] text-card">
                {badge}
              </div>
            )}
          </Link>
        </div>
      </NavGroupTooltip>
      {Popup && element && <Popup referenceElement={element} />}
    </>
  );
}
