"use client";

// import { CompanyType } from "@/server/schema";
import { IconPlus } from "@tabler/icons-react";

import { Company } from "@ziron/db/schema";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@ziron/ui/components/avatar";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@ziron/ui/components/sidebar";

interface Props {
  data?: Company[];
}

export function NavProjects({ data }: Props) {
  const { isMobile } = useSidebar();

  if (data)
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Companies</SidebarGroupLabel>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                tooltip={item.name}
                className="p-0 group-data-[collapsible=icon]:p-0!"
              >
                <Avatar>
                  <AvatarImage src={item.logo ?? undefined} />
                  <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span>{item.name}</span>
              </SidebarMenuButton>

              <SidebarMenuAction>
                <IconPlus className="size-3 text-gray-300" />
              </SidebarMenuAction>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
}
