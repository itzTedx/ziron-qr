"use client";

import { CSSProperties, PropsWithChildren } from "react";

import { atom, useAtom } from "jotai";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ziron/ui/components/sheet";
import { useIsMobile } from "@ziron/ui/hooks";

import { cn } from "@ziron/utils";

export const SIDEBAR_WIDTH = 290;
const SIDEBAR_GROUPS_WIDTH = 64;
const SIDEBAR_AREAS_WIDTH = SIDEBAR_WIDTH - SIDEBAR_GROUPS_WIDTH;

export const sidebarOpenMobileAtom = atom(false);

export function ResponsiveSidebar({ children }: PropsWithChildren) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useAtom(sidebarOpenMobileAtom);

  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile}>
        <SheetContent
          className="w-(--sidebar-width)! [&>button]:hidden"
          data-mobile="true"
          data-sidebar="sidebar"
          data-slot="sidebar"
          side="left"
          style={
            {
              "--sidebar-width": `${SIDEBAR_WIDTH}px`,
              "--sidebar-groups-width": `${SIDEBAR_GROUPS_WIDTH}px`,
              "--sidebar-areas-width": `${SIDEBAR_AREAS_WIDTH}px`,
            } as CSSProperties
          }
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn("h-full w-(--sidebar-width) transition-[width] duration-300 max-md:hidden")}
      style={
        {
          "--sidebar-width": `${SIDEBAR_WIDTH}px`,
          "--sidebar-groups-width": `${SIDEBAR_GROUPS_WIDTH}px`,
          "--sidebar-areas-width": `${SIDEBAR_AREAS_WIDTH}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
