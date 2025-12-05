"use client";

import { CSSProperties, PropsWithChildren, ReactNode, Suspense } from "react";

import { Route } from "next";
import Link from "next/link";

import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

import { IconLogo } from "@ziron/ui/assets/logo";

import { cn } from "@ziron/utils";

import { Tooltip } from "@/components/shared/tooltip";

import { NavUser } from "./nav-user";
import { NavGroupItem } from "./sidebar-nav-group-item";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarNavAreas, SidebarNavGroups } from "./types";

export const SIDEBAR_WIDTH = 280;
const SIDEBAR_GROUPS_WIDTH = 64;
const SIDEBAR_AREAS_WIDTH = SIDEBAR_WIDTH - SIDEBAR_GROUPS_WIDTH;

interface SidebarNavProps<T extends Record<string, unknown>> {
  groups: SidebarNavGroups<T>;
  areas: SidebarNavAreas;
  toolContent?: ReactNode;
}

export function SidebarNav<T extends Record<string, unknown>>({ groups, areas, toolContent }: SidebarNavProps<T>) {
  // const pathname = usePathname();

  // const currentArea = useMemo(() => {
  //   if (pathname.startsWith("/settings/account")) return "userSettings";
  //   if (pathname.startsWith("/workspace/settings")) return "workspaceSettings";
  //   return "default";
  // }, [pathname]);

  return (
    <div
      className={cn("h-full w-(--sidebar-width) transition-[width] duration-300")}
      style={
        {
          "--sidebar-width": `${SIDEBAR_WIDTH}px`,
          "--sidebar-groups-width": `${SIDEBAR_GROUPS_WIDTH}px`,
          "--sidebar-areas-width": `${SIDEBAR_AREAS_WIDTH}px`,
        } as CSSProperties
      }
    >
      {/* <ClientOnly className="size-full"> */}
      <nav className="grid size-full grid-cols-[var(--sidebar-groups-width)_1fr]">
        <div className="flex flex-col items-center justify-between">
          <div className="flex flex-col items-center p-2">
            <div className="pt-2 pb-1">
              <Link
                className="block rounded-lg px-1 py-4 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-black/50"
                href="/"
              >
                <IconLogo className="h-5" />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {groups.map((group, idx) => (
                <NavGroupItem group={group} key={`${group.name}_${idx + 1}`} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 py-3">
            {toolContent}
            <div className="flex size-12 items-center justify-center">
              <NavUser />
            </div>
          </div>
        </div>
        <div className={cn("size-full overflow-hidden py-2 pr-2 transition-opacity duration-300")}>
          <div className="scrollbar-hide relative flex h-full w-[calc(var(--sidebar-areas-width)-0.5rem)] flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-sidebar">
            <div className="relative flex grow flex-col p-3 text-muted-foreground">
              <div className="relative w-full grow">
                {Object.entries(areas).map(([area, areaConfig]) => {
                  const { title, backHref, content, direction } = areaConfig;

                  const TitleContainer = backHref ? Link : "div";

                  return (
                    <Area direction={direction ?? "left"} key={area} visible={true}>
                      {title &&
                        (typeof title === "string" ? (
                          <TitleContainer
                            className="group mb-2 flex items-center gap-3 px-3 py-2 text-sidebar-foreground"
                            href={backHref ?? "#"}
                          >
                            {backHref && (
                              <div
                                className={cn(
                                  "flex size-6 items-center justify-center rounded-md bg-muted/60",
                                  "group-hover:-translate-x-0.5 transition-[transform_background-color_color] duration-200 hover:bg-muted-foreground/20 group-hover:text-foreground"
                                )}
                              >
                                <ChevronLeft className="size-3 **:stroke-2" />
                              </div>
                            )}
                            <span className="font-semibold text-content-emphasis text-lg">{title}</span>
                          </TitleContainer>
                        ) : (
                          title
                        ))}
                      <div className="flex flex-col gap-8">
                        {content.map(({ name, items }, idx) => (
                          <div className="flex flex-col gap-0.5" key={`${name}_${idx + 1}`}>
                            {name && <div className="mb-2 pl-3 text-muted-foreground/80 text-sm">{name}</div>}
                            {items.map((item) => (
                              <Suspense key={item.name}>
                                <SidebarNavItem item={item} />
                              </Suspense>
                            ))}
                          </div>
                        ))}
                      </div>
                    </Area>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* </ClientOnly> */}
    </div>
  );
}

export function NavGroupTooltip({
  name,
  description,
  learnMoreHref,
  disabled,
  children,
}: PropsWithChildren<{
  name: string;
  description?: string;
  learnMoreHref?: string;
  disabled?: boolean;
}>) {
  return (
    <Tooltip
      className="e rounded-lg px-3 py-1.5 font-medium text-sm"
      content={
        <div>
          <span>{name}</span>
          {description && (
            <motion.div
              animate={{ opacity: 1, width: "auto", height: "auto" }}
              className="overflow-hidden"
              initial={{ opacity: 0, width: 0, height: 0 }}
              transition={{ delay: 0.5, duration: 0.25, type: "spring" }}
            >
              <div className="w-44 py-1 text-xs tracking-tight">
                <p className="text-content-muted">{description}</p>
                {learnMoreHref && (
                  <div className="mt-2.5">
                    <Link className="font-semibold underline" href={learnMoreHref as Route} target="_blank">
                      Learn more
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      }
      delayDuration={100}
      disabled={disabled}
      side="right"
    >
      {children}
    </Tooltip>
  );
}

export function Area({
  visible,
  direction,
  children,
}: PropsWithChildren<{ visible: boolean; direction: "left" | "right" }>) {
  return (
    <motion.div
      animate={
        visible
          ? {
              opacity: 1,
              x: 0,
            }
          : {
              opacity: 0,
              x: direction === "left" ? "-100%" : "100%",
            }
      }
      aria-hidden={!visible ? "true" : undefined}
      className={cn("top-0 left-0 flex size-full flex-col", visible ? "relative" : "pointer-events-none absolute")}
      inert={!visible}
      initial={false}
      transition={{
        duration: 0.15,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
