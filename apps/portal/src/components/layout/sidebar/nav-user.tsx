"use client";

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
import { Skeleton } from "@ziron/ui/components/skeleton";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { useSession } from "@/lib/auth/client";

export function NavUser() {
	const { data, isPending } = useSession();
	const user = data?.user;

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon-lg" variant="ghost">
						<Avatar className="size-8 rounded-lg">
							{isPending ? (
								<Skeleton className="size-full rounded-[inherit]" />
							) : (
								<>
									<AvatarImage alt={user?.name ?? ""} src={user?.image ?? undefined} />
									<AvatarFallback className="rounded-lg">
										{user?.name?.slice(0, 2) ?? ""}
									</AvatarFallback>
								</>
							)}
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="ml-2 w-[--radix-dropdown-menu-trigger-width] min-w-48 rounded-lg"
					sideOffset={6}
				>
					<DropdownMenuLabel className="font-normal">
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{user?.name ?? ""}</span>
							<span className="truncate text-muted-foreground text-xs">{user?.email ?? ""}</span>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link href="/settings/account">
								<IconUser className="size-4 text-muted-foreground" />
								Account Settings
							</Link>
						</DropdownMenuItem>
						<LogoutButton asChild>
							<DropdownMenuItem asChild>
								<button className="w-full">
									<IconLogout className="size-4 text-muted-foreground" />
									Log out
								</button>
							</DropdownMenuItem>
						</LogoutButton>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
