import { Suspense } from "react";

import Link from "next/link";

import { IconCard } from "@ziron/ui/assets/icons/card";
import { IconSettings } from "@ziron/ui/assets/icons/settings";
import { IconLogo } from "@ziron/ui/assets/logo";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@ziron/ui/components/context-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";

import { NavUser } from "@/components/layout/sidebar/nav-user";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const RootSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative grid w-full flex-1 md:grid-cols-[auto_230px_1fr]" vaul-drawer-wrapper="">
      <div className="-top-20 -left-20 absolute hidden h-64 w-64 bg-brand-secondary/8 blur-3xl md:block" />
      <div className="fixed top-0 left-0 z-50 hidden h-dvh w-screen bg-transparent transition-[background-color,backdrop-filter] max-md:pointer-events-none md:sticky md:z-auto md:block md:w-full">
        <div className="scrollbar-hide relative flex h-full w-[calc(var(--sidebar-areas-width)-0.5rem)] flex-col">
          <div className="flex flex-1 grow flex-col items-center justify-between">
            <div className="flex flex-col items-center p-2">
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <div className="py-2">
                    <Link
                      className="flex w-11 items-center justify-center rounded-lg px-1 py-2 outline-none transition-colors hover:bg-card/20 focus-visible:ring-2 focus-visible:ring-black/50"
                      href="/"
                    >
                      <IconLogo className="size-8" />
                    </Link>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-52">
                  <ContextMenuItem inset>
                    Back
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem disabled inset>
                    Forward
                    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem inset>
                    Reload
                    <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-44">
                      <ContextMenuItem>Save Page...</ContextMenuItem>
                      <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                      <ContextMenuItem>Name Window...</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem>Developer Tools</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSeparator />
                  <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>
                  <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
                  <ContextMenuSeparator />
                  <ContextMenuRadioGroup value="pedro">
                    <ContextMenuLabel inset>People</ContextMenuLabel>
                    <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
                    <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
                  </ContextMenuRadioGroup>
                </ContextMenuContent>
              </ContextMenu>
              {/* <div className="py-2">
                <Link
                  className="flex w-11 items-center justify-center rounded-lg px-1 py-2 outline-none transition-colors hover:bg-card/20 focus-visible:ring-2 focus-visible:ring-black/50"
                  href="/"
                >
                  <IconLogo className="size-8" />
                </Link>
              </div> */}

              <div className="flex flex-col items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="relative flex size-11 items-center justify-center rounded-lg bg-card outline-none transition-colors duration-150 hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-black/50"
                      href={"/cards"}
                    >
                      <IconCard className="size-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Digital Card</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 pb-3">
              <ThemeToggle />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    className="group relative flex size-11 items-center justify-center rounded-lg outline-none transition-colors duration-150 hover:bg-muted focus-visible:ring-2 focus-visible:ring-black/50"
                    href="/settings/account"
                  >
                    <IconSettings className="size-4 transition-transform duration-300 ease-tact group-hover:rotate-180" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>

              <Suspense fallback={<div className="size-11" />}>
                <NavUser />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
