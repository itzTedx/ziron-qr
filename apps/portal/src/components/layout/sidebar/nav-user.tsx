"use client";

import Link from "next/link";

import { IconLogout, IconUserEdit } from "@tabler/icons-react";
import { ChevronsUpDown } from "lucide-react";

import { User } from "@ziron/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@ziron/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ziron/ui/components/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@ziron/ui/components/sidebar";

import { LogoutButton } from "@/components/ui/logout-button";

export function NavUser({ user }: { user: User }) {
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:p-0!"
                size="lg"
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage alt={user.name} src={user.image ?? undefined} />
                  <AvatarFallback className="rounded-lg">{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="ml-2 w-[--radix-dropdown-menu-trigger-width] min-w-44 rounded-lg"
              sideOffset={6}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/account/settings">
                    <IconUserEdit className="size-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogoutButton>
                    <IconLogout className="size-4" />
                    Log out
                  </LogoutButton>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
