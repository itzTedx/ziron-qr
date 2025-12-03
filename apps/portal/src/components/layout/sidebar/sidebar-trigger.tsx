"use client";

import { useContext } from "react";

import { Menu } from "lucide-react";

import { Button } from "@ziron/ui/components/button";

import { cn } from "@ziron/utils";

import { SideNavContext } from "./main-nav";

export function SidebarTrigger({ className }: { className?: string }) {
  const { isOpen, setIsOpen } = useContext(SideNavContext);

  return (
    <Button
      aria-label="Toggle sidebar"
      className={cn("md:hidden", className)}
      onClick={() => setIsOpen(!isOpen)}
      size="icon"
      variant="ghost"
    >
      <Menu />
    </Button>
  );
}
