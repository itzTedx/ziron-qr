"use client";

import { Menu } from "lucide-react";

import { Button } from "@ziron/ui/components/button";

import { cn } from "@ziron/utils";

export function SidebarTrigger({ className }: { className?: string }) {
  return (
    <Button aria-label="Toggle sidebar" className={cn("md:hidden", className)} size="icon" variant="ghost">
      <Menu />
    </Button>
  );
}
