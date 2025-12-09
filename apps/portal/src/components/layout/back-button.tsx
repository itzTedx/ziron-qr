"use client";

import { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { IconChevronLeft } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";

export const BackButton = ({ href }: { href?: Route }) => {
	const router = useRouter();

	return (
		<Button
			className="fade-in slide-in-from-left-2 hover:-translate-x-0.5 group-hover:-translate-x-0.5 flex size-6 animate-in items-center justify-center rounded-md bg-muted/60 text-muted-foreground transition-[transform_background-color_color] duration-200 hover:bg-muted-foreground/20 hover:text-foreground group-hover:bg-muted-foreground/20 group-hover:text-foreground"
			{...(href ? null : { onClick: () => router.back() })}
			asChild={!!href}
			size="icon-sm"
			variant="secondary"
		>
			{href ? (
				<Link href={href}>
					<IconChevronLeft className="size-3" />
				</Link>
			) : (
				<div>
					<IconChevronLeft className="size-3" />
				</div>
			)}
		</Button>
	);
};
