"use client";

import * as React from "react";
import Link from "next/link";

import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavUser } from "@/components/layout/sidebar/nav-user";

import type { Company } from "@ziron/db/schema";
import { User } from "@ziron/auth";
import { IconLogo } from "@ziron/ui/assets/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@ziron/ui/components/sidebar";

import { NavProjects } from "./nav-projects";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data?: Company[];
  user: User;
}

export function AppSidebar({ data, user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconLogo className="!size-5" />
                <span>
                  <span className="truncate font-semibold">Ziron Media</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
        <NavProjects data={data} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
