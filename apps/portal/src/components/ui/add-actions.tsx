"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { IconPlus } from "@tabler/icons-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@ziron/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@ziron/ui/components/dropdown-menu";

export function AddAction() {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const [_, setCompanyModal] = useQueryStates({
		modal: parseAsString,
	});

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();

				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return;
				}

				localStorage.removeItem("card-form-data");
				router.push("/card/new");
			}
			if (e.key === "D" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return;
				}
				e.preventDefault();
				// openModal();
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [router]);

	return (
		<>
			<DropdownMenu onOpenChange={setOpen} open={open}>
				<DropdownMenuTrigger asChild>
					<Button className="flex-shrink-0" size="icon" variant="outline">
						<span className="sr-only">Add new company or digital card</span>
						<IconPlus className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[10rem]">
					<DropdownMenuLabel>Add new</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="group cursor-pointer transition hover:bg-secondary hover:text-background"
						onClick={() => {
							setCompanyModal({ modal: "company" });
							setOpen(false);
						}}
					>
						Company
						<kbd className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-2.5 hidden h-5 select-none items-center justify-center gap-1 rounded border bg-muted px-1.5 align-top font-medium font-mono text-xs opacity-100 sm:flex">
							<span className="text-[9px]">⌘ </span> <span className="-mt-[0.13rem] text-[12px]">⇧ </span>
							<span className="-mt-0.5">D</span>
						</kbd>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="group transition hover:bg-secondary hover:text-background"
						onClick={() => setOpen(false)}
					>
						<Link href="/card/new" onClick={() => localStorage.removeItem("card-form-data")}>
							Digital Card
							<kbd className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-2.5 hidden h-5 select-none items-center justify-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-xs opacity-100 sm:flex">
								<span className="text-[9px]">⌘</span> <span className="-mt-0.5">D</span>
							</kbd>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
