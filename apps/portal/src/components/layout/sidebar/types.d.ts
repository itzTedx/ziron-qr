import type { ComponentType, ReactNode, SVGProps } from "react";

import { Route } from "next";

import type { Icon as TablerIcon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";

export type Icon = TablerIcon | LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

export type SidebarNavData = {
  slug: string;
  pathname: string;
};

export type NavItemCommon = {
  name: string;
  href: Route;
  exact?: boolean;
  isActive?: (pathname: string, href: string) => boolean;
  badge?: ReactNode;
  arrow?: boolean;
  locked?: boolean;
};

export type NavSubItemType = NavItemCommon;

export type NavItemType = NavItemCommon & {
  icon: Icon;
  items?: NavSubItemType[];
};

export type NavGroupType = {
  name: string;
  icon: Icon;
  href: Route;
  active: boolean;
  onClick?: () => void;
  popup?: ComponentType<{
    referenceElement: HTMLElement | null;
  }>;
  badge?: ReactNode;

  description: string;
  learnMoreHref?: string;
};

export type SidebarNavGroups<T extends Record<string, unknown>> = (args: T) => NavGroupType[];

export type SidebarNavAreas<T extends Record<string, unknown>> = Record<
  string,
  (args: T) => {
    title?: string | ReactNode;
    backHref?: Route;
    showNews?: boolean; // show news segment – TODO: enable this for Partner Program too
    hideSwitcherIcons?: boolean; // hide workspace switcher + product icons for this area
    direction?: "left" | "right";
    content: {
      name?: string;
      items: NavItemType[];
    }[];
  }
>;
