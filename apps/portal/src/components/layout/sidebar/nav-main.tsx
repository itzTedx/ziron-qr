"use client";

import Link from "next/link";

import { IconBuildingCog, IconCards } from "@tabler/icons-react";
import { parseAsString, useQueryStates } from "nuqs";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ziron/ui/components/sidebar";

export function NavMain() {
  const [, setCompanyModal] = useQueryStates({
    modal: parseAsString,
  });
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="truncate">Digital Card</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => {
              setCompanyModal({ modal: "company" });
            }}
            tooltip={"Digital Card"}
          >
            <IconBuildingCog />
            <span className="font-medium text-sm">Add Company</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/card/new">
            <SidebarMenuButton tooltip={"Digital Card"}>
              <IconCards />
              <span className="font-medium text-sm">Create Card</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
