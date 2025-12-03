"use client";

import { ReactNode, useMemo } from "react";

import { useParams, usePathname } from "next/navigation";

import { Bell, ShieldCheck } from "lucide-react";

import { IconBuilding } from "@ziron/ui/assets/icons/building";
import { IconCard, IconCard2 } from "@ziron/ui/assets/icons/card";
import { IconSettings } from "@ziron/ui/assets/icons/settings";

import { IconLinesY } from "@/assets/icons/lines-y";

import { useSession } from "@/lib/auth/client";

import { SidebarNav } from "./sidebar-nav";
import { SidebarNavAreas, SidebarNavData, SidebarNavGroups } from "./types";

const FIVE_YEARS_SECONDS = 60 * 60 * 24 * 365 * 5;

const NAV_GROUPS: SidebarNavGroups<SidebarNavData> = ({ slug }) => [
  {
    name: "Digital Card",
    description: "Create, organize, and measure the performance of your digital cards.",
    icon: IconCard,
    href: "/cards",
    active: true,
    // active: pathname.startsWith("/cards"),

    onClick: () => {
      document.cookie = `ziron:${slug}=card;path=/;max-age=${FIVE_YEARS_SECONDS}`;
    },
  },
];

const NAV_AREAS: SidebarNavAreas<SidebarNavData> = {
  // Top-level
  default: ({ pathname }) => ({
    title: "Digital Cards",
    direction: "left",
    content: [
      {
        items: [
          {
            name: "Cards",
            icon: IconCard2,
            href: "/cards",
            isActive: () => pathname.startsWith("/cards"),
          },
          {
            name: "Organizations",
            icon: IconBuilding,
            href: "/organization",
            isActive: () => pathname.startsWith("/organization"),
          },
        ],
      },
      {
        name: "Insights",
        items: [
          {
            name: "Analytics",
            icon: IconLinesY,
            href: "/analytics",
          },
          // {
          //   name: "Events",
          //   icon: CursorRays,
          //   href: "/cards/events",
          // },
        ],
      },
      // {
      //   name: "Library",
      //   items: [
      //     {
      //       name: "Folders",
      //       icon: Folder,
      //       href: "/cards/folders",
      //     },
      //     {
      //       name: "Tags",
      //       icon: Tag,
      //       href: "/cards/tags",
      //     },
      //     {
      //       name: "UTM Templates",
      //       icon: Link2,
      //       href: "/cards/utm",
      //     },
      //   ],
      // },
    ],
  }),

  // Workspace settings
  workspaceSettings: () => ({
    title: "Settings",
    backHref: "/cards",
    direction: "right",
    content: [
      {
        name: "Workspace",
        items: [
          {
            name: "General",
            icon: IconSettings,
            href: "/workspace/settings",
            exact: true,
          },
          // {
          //   name: "Members",
          //   icon: IconUsers6,
          //   href: "/workspace/settings/members",
          // },
          // {
          //   name: "Integrations",
          //   icon: IconConnectedDots,
          //   href: "/workspace/settings/integrations",
          // },
        ],
      },

      {
        name: "Account",
        items: [
          {
            name: "Notifications",
            icon: Bell,
            href: "/workspace/settings/notifications",
          },
        ],
      },
    ],
  }),

  // User settings
  userSettings: () => ({
    title: "Settings",
    backHref: "/cards",
    direction: "right",
    hideSwitcherIcons: true,
    content: [
      {
        name: "Account",
        items: [
          {
            name: "General",
            icon: IconSettings,
            href: "/settings/account",
            exact: true,
          },
          {
            name: "Security",
            icon: ShieldCheck,
            href: "/settings/security",
          },
        ],
      },
    ],
  }),
};

export function AppSidebarNav({ toolContent }: { toolContent?: ReactNode }) {
  const { slug } = useParams() as { slug?: string };
  const pathname = usePathname();
  const { data: session } = useSession();

  const currentArea = useMemo(() => {
    if (pathname.startsWith("/settings/account")) return "userSettings";
    if (pathname.startsWith("/workspace/settings")) return "workspaceSettings";
    return "default";
  }, [pathname]);

  return (
    <SidebarNav
      areas={NAV_AREAS}
      currentArea={currentArea}
      data={{
        slug: slug || "",
        pathname,
        session: session || undefined,
      }}
      groups={NAV_GROUPS}
      // switcher={<WorkspaceDropdown />}
      toolContent={toolContent}
    />
  );
}
