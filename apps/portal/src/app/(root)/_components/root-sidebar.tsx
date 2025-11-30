import { Suspense } from "react";

import type { Route } from "next";
import Link from "next/link";

import { IconCard } from "@ziron/ui/assets/icons/card";
import { IconSettings } from "@ziron/ui/assets/icons/settings";
import { IconLogo } from "@ziron/ui/assets/logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";

import { NavUser } from "@/components/layout/sidebar/nav-user";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { ShareModal } from "@/features/modal/share-modal";
import CompanyFormModal from "@/features/organization/components/modal";

export const RootSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative grid w-full flex-1 md:grid-cols-[auto_230px_1fr]" vaul-drawer-wrapper="">
      <div className="-top-20 -left-20 absolute hidden h-64 w-64 bg-brand-secondary/8 blur-3xl md:block" />
      <div className="fixed top-0 left-0 z-50 hidden h-dvh w-screen bg-transparent transition-[background-color,backdrop-filter] max-md:pointer-events-none md:sticky md:z-auto md:block md:w-full">
        <div className="scrollbar-hide relative flex h-full w-[calc(var(--sidebar-areas-width)-0.5rem)] flex-col">
          <div className="flex flex-1 grow flex-col items-center justify-between">
            <div className="flex flex-col items-center p-2">
              <div className="pt-2 pb-2">
                <Link
                  className="flex w-11 items-center justify-center rounded-lg px-1 py-2 outline-none transition-colors hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-black/50"
                  href="/"
                >
                  <IconLogo className="size-8" />
                </Link>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="relative flex size-11 items-center justify-center rounded-lg bg-card outline-none transition-colors duration-150 hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-black/50"
                      href={"/"}
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
                    href={"/account/settings" as Route}
                  >
                    <IconSettings className="size-4 transition-transform duration-300 group-hover:rotate-45" />
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

      <Suspense>
        <ShareModal />
      </Suspense>

      <Suspense>
        <CompanyFormModal />
      </Suspense>
    </div>
  );
};
