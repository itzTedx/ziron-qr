// import { CompanyType } from "@/server/schema";
import { IconPlus } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@ziron/ui/components/avatar";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ziron/ui/components/sidebar";

import { Company } from "@ziron/db/schema";

interface Props {
  data?: Company[];
}

export function NavProjects({ data }: Props) {
  if (data)
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Companies</SidebarGroupLabel>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton className="p-0 group-data-[collapsible=icon]:p-0!" tooltip={item.name}>
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
