"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@ziron/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ziron/ui/components/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button className="group relative duration-150 hover:bg-muted" size="icon-lg" variant="ghost">
              <Sun className="dark:-rotate-90 size-4 rotate-0 scale-100 transition-all duration-300 group-hover:rotate-45 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all duration-300 group-hover:rotate-90 dark:rotate-0 dark:scale-100" />

              <span className="sr-only"> Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>

        <TooltipContent side="right">
          <p>Theme</p>
        </TooltipContent>

        <DropdownMenuContent
          align="end"
          className="ml-2 w-[--radix-dropdown-menu-trigger-width] min-w-48 rounded-lg"
          sideOffset={4}
        >
          <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
}
