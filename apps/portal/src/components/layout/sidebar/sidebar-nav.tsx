import { CSSProperties, PropsWithChildren, ReactNode, useMemo, useState } from "react";

import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconLock } from "@tabler/icons-react";
import { ArrowUpRight, ChevronDown, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { IconLogo } from "@ziron/ui/assets/logo";
import { AnimatedSizeContainer } from "@ziron/ui/components/animated-size-container";
import { ClientOnly } from "@ziron/ui/components/client-only";

import { cn } from "@ziron/utils";

import { Tooltip } from "@/components/shared/tooltip";

import { NavUser } from "./nav-user";
import { NavGroupType, NavItemType, NavSubItemType, SidebarNavAreas, SidebarNavGroups } from "./types";

const SIDEBAR_WIDTH = 304;
const SIDEBAR_GROUPS_WIDTH = 64;
const SIDEBAR_AREAS_WIDTH = SIDEBAR_WIDTH - SIDEBAR_GROUPS_WIDTH;

export function SidebarNav<T extends Record<string, unknown>>({
  groups,
  areas,
  currentArea,
  data,
  toolContent,
  newsContent,
  switcher,
  bottom,
}: {
  groups: SidebarNavGroups<T>;
  areas: SidebarNavAreas<T>;
  currentArea: string | null;
  data: T;
  toolContent?: ReactNode;
  newsContent?: ReactNode;
  switcher?: ReactNode;
  bottom?: ReactNode;
}) {
  return (
    <div
      className={cn("h-full w-(--sidebar-width) transition-[width] duration-300")}
      style={
        {
          "--sidebar-width": `${currentArea === null ? SIDEBAR_GROUPS_WIDTH : SIDEBAR_WIDTH}px`,
          "--sidebar-groups-width": `${SIDEBAR_GROUPS_WIDTH}px`,
          "--sidebar-areas-width": `${SIDEBAR_AREAS_WIDTH}px`,
        } as CSSProperties
      }
    >
      <ClientOnly className="size-full">
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
              {(!currentArea || !areas[currentArea]?.(data)?.hideSwitcherIcons) && (
                <div className="flex flex-col gap-3">
                  {switcher}
                  {groups(data).map((group) => (
                    <NavGroupItem group={group} key={group.name} />
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-3 py-3">
              {toolContent}
              <div className="flex size-12 items-center justify-center">
                <NavUser />
              </div>
            </div>
          </div>
          <div
            className={cn(
              "size-full overflow-hidden py-2 pr-2 transition-opacity duration-300",
              currentArea === null && "opacity-0"
            )}
          >
            <div className="scrollbar-hide relative flex h-full w-[calc(var(--sidebar-areas-width)-0.5rem)] flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-sidebar">
              <div className="relative flex grow flex-col p-3 text-muted-foreground">
                <div className="relative w-full grow">
                  {Object.entries(areas).map(([area, areaConfig]) => {
                    const { title, backHref, content, direction } = areaConfig(data);

                    const TitleContainer = backHref ? Link : "div";

                    return (
                      <Area direction={direction ?? "left"} key={area} visible={area === currentArea}>
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
                                <NavItem item={item} key={item.name} />
                              ))}
                            </div>
                          ))}
                        </div>
                      </Area>
                    );
                  })}
                </div>
              </div>

              {/* Fixed bottom sections */}
              <div className="flex flex-col gap-2">
                <AnimatePresence>
                  {currentArea && areas[currentArea]?.(data)?.showNews && (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      initial={{ opacity: 0, y: 10 }}
                      transition={{
                        duration: 0.1,
                        ease: "easeInOut",
                      }}
                    >
                      {newsContent}
                    </motion.div>
                  )}
                </AnimatePresence>

                {bottom && <div className="flex flex-col">{bottom}</div>}
              </div>
            </div>
          </div>
        </nav>
      </ClientOnly>
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
      className="rounded-lg bg-black px-3 py-1.5 font-medium text-sm text-white"
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
                    <Link className="font-semibold text-white underline" href={learnMoreHref as Route} target="_blank">
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

function NavGroupItem({
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
              "relative flex size-11 items-center justify-center rounded-lg transition-colors duration-150",
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

function NavItem({ item }: { item: NavItemType | NavSubItemType }) {
  const { name, href, isActive: customIsActive, locked, exact } = item;

  const Icon = "icon" in item ? item.icon : undefined;
  const items = "items" in item ? item.items : undefined;

  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const isActive = useMemo(() => {
    if (customIsActive) {
      return customIsActive(pathname, href);
    }

    const hrefWithoutQuery = href.split("?")[0];
    return exact ? pathname === hrefWithoutQuery : pathname.startsWith(hrefWithoutQuery ?? "");
  }, [pathname, href, customIsActive, exact]);

  return (
    <div>
      <Link
        aria-disabled={locked}
        className={cn(
          "group flex h-8 items-center justify-between rounded-lg p-2 text-content-default text-sm leading-none transition-[background-color,color,font-weight] duration-75",
          "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
          isActive && !items
            ? "bg-brand-secondary/10 font-medium text-brand-secondary hover:bg-brand-secondary/20 active:bg-brand-secondary/30"
            : locked
              ? "cursor-not-allowed opacity-75"
              : "hover:bg-bg-inverted/5 active:bg-bg-inverted/10"
        )}
        data-active={isActive}
        href={locked ? "#" : href}
        onPointerEnter={() => !locked && setHovered(true)}
        onPointerLeave={() => !locked && setHovered(false)}
      >
        <span className="flex items-center gap-2.5">
          {locked ? (
            <IconLock className="size-4" />
          ) : (
            Icon && (
              <Icon
                className={cn("size-4", !items && "group-data-[active=true]:text-brand-secondary")}
                data-hovered={hovered}
              />
            )
          )}
          {name}
        </span>
        <span className="ml-2 flex items-center gap-2">
          {items && (
            <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-75 group-data-[active=true]:rotate-180" />
          )}
          {item.arrow && (
            <ArrowUpRight className="group-hover:-translate-y-px size-3.5 text-content-default transition-transform duration-75 group-hover:translate-x-px" />
          )}
        </span>
      </Link>
      {items && (
        <AnimatedSizeContainer height transition={{ duration: 0.2, ease: "easeInOut" }}>
          <div
            aria-hidden={!isActive}
            className={cn("transition-opacity duration-200", isActive ? "h-auto" : "h-0 opacity-0")}
          >
            <div className="pt-1 pl-px">
              <div className="pl-3.5">
                <div className="flex flex-col gap-0.5 border-l pl-2">
                  {items.map((item) => (
                    <NavItem item={item} key={item.name} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSizeContainer>
      )}
    </div>
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
