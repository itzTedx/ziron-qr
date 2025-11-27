import { Route } from "next";
import Link from "next/link";

import { IconChartLine, IconChevronRight, IconPhoto, IconTemplate } from "@tabler/icons-react";

import { IconBuilding } from "@ziron/ui/assets/icons/building";
import { IconCard2 } from "@ziron/ui/assets/icons/card";
import { IconMouse } from "@ziron/ui/assets/icons/mouse";
import { Label } from "@ziron/ui/components/label";
import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

import { UsageMetrics } from "./_components/usage-metrics";

interface Props {
  children: React.ReactNode;
}

export default function DigitalCardLayout({ children }: Props) {
  const queryClient = getQueryClient();
  return (
    <>
      <aside className="fixed top-0 left-0 z-50 hidden h-dvh w-screen bg-transparent transition-[background-color,backdrop-filter] max-md:pointer-events-none md:sticky md:z-auto md:block md:w-full">
        <div className="size-full overflow-hidden py-2 pr-2 transition-opacity duration-300">
          <div className="scrollbar-hide relative flex h-full flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-sidebar">
            <div className="relative flex grow flex-col p-3 text-stone-500">
              <Link className="group mb-2 flex items-center gap-3 px-3 py-2" href="/">
                <span className="font-semibold text-foreground text-lg transition-colors duration-150 group-hover:text-foreground">
                  Digital Cards
                </span>
              </Link>

              <div className="flex flex-col gap-8">
                <ul className="space-y-0.5">
                  <li>
                    <Link
                      className="flex items-center gap-2 rounded-lg bg-brand-secondary/10 px-3 py-2 text-brand-secondary hover:bg-muted"
                      href={"/"}
                    >
                      <IconCard2 className="size-4" />
                      <span className="text-sm">Cards</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground/90 hover:bg-muted"
                      href={"/organization" as Route}
                    >
                      <IconBuilding className="size-4" />
                      <span className="text-sm">Organizations</span>
                    </Link>
                  </li>
                </ul>

                <div className="flex flex-col gap-0.5">
                  <Label className="my-2 px-3 font-light text-muted-foreground">Insights</Label>
                  <ul className="space-y-0.5">
                    <li>
                      <Link
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground/90 hover:bg-muted"
                        href={"/account/settings" as Route}
                      >
                        <IconChartLine className="size-4" />
                        <span className="text-sm">Analytics</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground/90 hover:bg-muted"
                        href={"/account/settings" as Route}
                      >
                        <IconMouse className="size-4" />
                        <span className="text-sm">Events</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-0.5">
                  <Label className="my-2 px-3 font-light text-muted-foreground">Library</Label>
                  <ul className="space-y-0.5">
                    <li>
                      <Link
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground/90 hover:bg-muted"
                        href={"/account/settings" as Route}
                      >
                        <IconTemplate className="size-4" />
                        <span className="text-sm">Templates</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground/90 hover:bg-muted"
                        href={"/account/settings" as Route}
                      >
                        <IconPhoto className="size-4" />
                        <span className="text-sm">Media</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t">
              <div className="flex flex-col gap-4 p-3 pt-4">
                <Label>
                  Usage <IconChevronRight className="size-3 text-muted-foreground" />
                </Label>
                <HydrateClient client={queryClient}>
                  <UsageMetrics />
                </HydrateClient>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="h-screen md:pt-2 md:pr-2 md:pb-2">
        <ScrollArea className="h-full bg-card md:rounded-xl">
          <main className="">{children}</main>
          <ScrollBar />
        </ScrollArea>
      </div>
    </>
  );
}
