import { Route } from "next";
import Link from "next/link";

import { IconLogout } from "@tabler/icons-react";

import { IconUser } from "@ziron/ui/assets/icons/user";
import { Avatar, AvatarFallback, AvatarImage } from "@ziron/ui/components/avatar";
import { Button } from "@ziron/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ziron/ui/components/dropdown-menu";

import { getCurrentUser } from "@/features/auth/actions/user";
import { LogoutButton } from "@/features/auth/components/logout-button";

export async function NavUser() {
  const { user } = await getCurrentUser();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-lg" variant="ghost">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage alt={user.name} src={user.image ?? undefined} />
              <AvatarFallback className="rounded-lg">{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="ml-2 w-[--radix-dropdown-menu-trigger-width] min-w-48 rounded-lg"
          sideOffset={6}
        >
          <DropdownMenuLabel className="px-2 py-1 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-muted-foreground text-xs">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={"/account/settings" as Route}>
                <IconUser className="size-4 text-muted-foreground" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutButton>
                <IconLogout className="size-4 text-muted-foreground" />
                Log out
              </LogoutButton>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
