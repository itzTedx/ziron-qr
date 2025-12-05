"use client";

import { useCallback } from "react";

import { useAtom } from "jotai";
import { PanelLeftOpenIcon } from "lucide-react";

import { Button } from "@ziron/ui/components/button";

import { cn } from "@ziron/utils";

import { sidebarOpenMobileAtom } from "./responsive-sidebar";

export function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const [_, setOpenMobile] = useAtom(sidebarOpenMobileAtom);

  // Helper to toggle the sidebar.
  const toggleSidebar = useCallback(() => {
    return setOpenMobile((open) => !open);
  }, [setOpenMobile]);

  return (
    <Button
      className={cn("size-7", className)}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      size="icon"
      variant="ghost"
      {...props}
    >
      <PanelLeftOpenIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
