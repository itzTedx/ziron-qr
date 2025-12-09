"use client";

import Image from "next/image";

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc/client";

interface AvatarImageClientProps {
	name: string;
	image?: string | null;
	size?: number;
	rounded?: number;
	text?: string;
	className?: string;
	alt?: string;
}

/**
 * Client Component: Avatar image using React Query with orpc
 * Falls back to generated avatar if no image is provided
 */
export function AvatarImageClient({
	name,
	image,
	size = 120,
	text,
	rounded = 999,
	className,
	alt,
}: AvatarImageClientProps) {
	const { data: svg } = useSuspenseQuery(
		orpc.avatar.get.v1.queryOptions({
			input: {
				name,
				text,
				size,
				rounded,
			},
		})
	);

	const avatarUrl = image ?? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

	return <Image alt={alt ?? `${name}'s avatar`} className={className} height={size} src={avatarUrl} width={size} />;
}
