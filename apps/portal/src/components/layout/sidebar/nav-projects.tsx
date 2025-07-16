"use client";

import Image from "next/image";
import Link from "next/link";

// import { CompanyType } from "@/server/schema";
import { IconCards, IconDots } from "@tabler/icons-react";
import { Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ziron/ui/components/dropdown-menu";
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
  data?: CompanyType[];
}

export function NavProjects({ data }: Props) {
  const { isMobile } = useSidebar();

  if (data)
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Companies</SidebarGroupLabel>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={item.name}>
                <Link href="/">
                  {item.logo && (
                    <div className="relative size-4 shrink-0">
                      <Image
                        src={item.logo}
                        fill
                        alt={item.name}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <IconCards className="text-muted-foreground size-4" />
                    <span className="pl-1 text-sm">Create card</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground size-4" />
                    <span className="pl-1 text-sm">Delete Company</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
}
