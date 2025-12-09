"use client";

import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { IconExternalLink, IconLoader, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";

import { Button } from "@ziron/ui/components/button";
import { Kbd } from "@ziron/ui/components/kbd";
import { Label } from "@ziron/ui/components/label";
import { ProgressiveBlur } from "@ziron/ui/components/progressive-blur";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";

import { CardType } from "@ziron/db/schema";
import { cn } from "@ziron/utils";

import { CopyButton } from "@/components/ui/copy-button";
import {
	ResponsiveModal,
	ResponsiveModalContent,
	ResponsiveModalDescription,
	ResponsiveModalHeader,
	ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Tilt, TiltContent } from "@/components/ui/tilt";

import { constructUrl } from "@/lib/link/construct-url";
import { orpc } from "@/lib/orpc/client";

import { closeShareModalAtom, shareModalAtom } from "../organization/atom";
import QRCodeDownload from "./components/qr-download";

export const ShareModal = () => {
	const modalState = useAtomValue(shareModalAtom);
	const closeModal = useSetAtom(closeShareModalAtom);

	const handleClose = (open: boolean) => {
		if (!open) {
			closeModal();
		}
	};

	const id = modalState.data;

	const { data, isLoading } = useQuery({
		...orpc.card.get.queryOptions({ input: { id: id?.cardId } }),
		enabled: !!id?.cardId,
	});

	if (!id?.cardId || !data) {
		return null;
	}

	const shareToSocial = (platform: string) => {
		const encodedUrl = encodeURIComponent(constructUrl(data.slug));
		const encodedText = encodeURIComponent(`Check out ${data.name}'s digital card`);

		const shareUrls: Record<string, string> = {
			twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
			whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
		};

		const shareUrl = shareUrls[platform];
		if (shareUrl) {
			window.open(shareUrl, "_blank", "noopener,noreferrer");
		}
	};

	return (
		<ResponsiveModal onOpenChange={handleClose} open={modalState.open}>
			<ResponsiveModalContent className="gap-0 sm:max-w-4xl">
				<ResponsiveModalHeader className="flex-row items-center justify-between">
					<ResponsiveModalTitle>Share digital card</ResponsiveModalTitle>
					<ResponsiveModalDescription className="sr-only">
						Share the digital card with your friends and family.
					</ResponsiveModalDescription>
					<Tooltip>
						<TooltipTrigger asChild>
							<Kbd className="group" size="lg" variant="outline">
								<span className="fade-out zoom-in-50 animate-in duration-200 group-hover:hidden">
									S
								</span>
								<span className="fade-in zoom-in-50 hidden animate-in duration-200 group-hover:block">
									<IconX />
								</span>
							</Kbd>
						</TooltipTrigger>
						<TooltipContent side="right">
							Press <span className="font-semibold">S</span> to open this quickly
						</TooltipContent>
					</Tooltip>
				</ResponsiveModalHeader>
				{isLoading ? (
					<IconLoader className="size-4 animate-spin" />
				) : (
					<div className="grid grid-cols-7 overflow-hidden rounded-b-[inherit]">
						<ProfileCard className="col-span-3 m-6" data={data} />

						<div className="col-span-4 flex flex-col gap-6 border-l bg-card p-6">
							<QRCodeDownload
								data={{
									name: data.name,
									url: constructUrl(data.slug),
									logo: data.organization.logo ?? undefined,
								}}
							/>

							{/* Copy Link */}
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between">
									<Label>Link</Label>

									<Link
										className="flex items-center gap-1.5 text-muted-foreground text-xs hover:underline"
										href={constructUrl(data.slug) as Route}
										target="_blank"
									>
										Open in new tab
										<IconExternalLink className="size-3" />
									</Link>
								</div>
								<CopyButton link={constructUrl(data.slug)} />
							</div>

							{/* Social Share Buttons */}
							<div className="flex flex-col gap-2">
								<Label>Share on</Label>

								<div className="grid grid-cols-4 gap-2">
									<Button
										className="flex h-auto flex-col gap-2 py-3"
										onClick={() => shareToSocial("twitter")}
										size="sm"
										variant="outline"
									>
										<Image alt="Twitter" height={20} src="/icons/x.svg" width={20} />
										<span className="text-xs">Twitter</span>
									</Button>
									<Button
										className="flex h-auto flex-col gap-2 py-3"
										onClick={() => shareToSocial("facebook")}
										size="sm"
										variant="outline"
									>
										<Image alt="Facebook" height={20} src="/icons/fb.svg" width={20} />
										<span className="text-xs">Facebook</span>
									</Button>
									<Button
										className="flex h-auto flex-col gap-2 py-3"
										onClick={() => shareToSocial("linkedin")}
										size="sm"
										variant="outline"
									>
										<Image alt="LinkedIn" height={20} src="/icons/linkedin.svg" width={20} />
										<span className="text-xs">LinkedIn</span>
									</Button>
									<Button
										className="flex h-auto flex-col gap-2 py-3"
										onClick={() => shareToSocial("whatsapp")}
										size="sm"
										variant="outline"
									>
										<Image alt="WhatsApp" height={20} src="/icons/whatsapp.svg" width={20} />
										<span className="text-xs">WhatsApp</span>
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</ResponsiveModalContent>
		</ResponsiveModal>
	);
};

interface ProfileCardProps {
	data: Pick<CardType, "name" | "designation" | "image" | "cover" | "organization">;
	className?: string;
}

function ProfileCard({ data, className }: ProfileCardProps) {
	return (
		<Tilt className={cn(className)} maxTilt={6} perspective={1200}>
			<TiltContent asChild className="fade-in-80 zoom-in-90 animate-in duration-300 ease-tact">
				<div className="relative aspect-3/4 overflow-hidden rounded-lg border bg-linear-45 from-primary to-brand-secondary">
					<div className="relative z-10 flex h-full flex-col justify-between gap-2 p-6">
						{data.organization.logo ? (
							<div className="flex size-12 shrink-0 items-center justify-center rounded-sm border bg-white p-2">
								<Image
									alt={`${data.name}'s Logo`}
									className="size-8 object-contain"
									height={48}
									src={data.organization.logo}
									width={48}
								/>
							</div>
						) : (
							<p>{data.organization.name}</p>
						)}
						<div className="flex items-center justify-center">
							<Image
								alt={`${data.name}'s Photo`}
								className="rounded-full"
								height={152}
								src={data.image}
								width={152}
							/>
						</div>
						<div>
							<h2 className="truncate font-bold text-xl">{data.name}</h2>
							<p className="text-foreground/80 text-sm">{data.designation}</p>
						</div>
					</div>
					<ProgressiveBlur
						blurIntensity={6}
						className="pointer-events-none absolute bottom-0 left-0 z-1 h-1/3 w-full brightness-50"
					/>
					<ProgressiveBlur
						blurIntensity={6}
						className="pointer-events-none absolute top-0 left-0 z-1 h-1/3 w-full brightness-50"
						direction="top"
					/>
					<div className="absolute" />
					{data.cover && (
						<Image alt={`${data.name}'s Cover`} className="object-cover" fill src={data.cover} />
					)}
				</div>
			</TiltContent>
		</Tilt>
	);
}
