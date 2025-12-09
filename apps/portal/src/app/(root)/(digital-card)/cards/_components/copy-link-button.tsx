"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import { Kbd } from "@ziron/ui/components/kbd";
import { useCopyToClipboard, useKeyboardShortcut } from "@ziron/ui/hooks";

import { cn } from "@ziron/utils";

import { env } from "@/lib/env/client";

export const CopyLinkButton = ({ slug }: { slug?: string | null }) => {
	const { isCopied, copyToClipboard } = useCopyToClipboard();

	function handleCopyLink() {
		if (!slug) return;
		copyToClipboard(`${env.NEXT_PUBLIC_CLIENT_URL}/${slug}`);
	}

	useKeyboardShortcut("c", handleCopyLink, { priority: 5 });

	return (
		<Button
			className="group font-medium max-md:size-8 md:pl-2"
			onClick={handleCopyLink}
			size="sm"
			type="button"
			variant="outline"
		>
			{isCopied ? (
				<div className="inline-flex h-5 w-fit min-w-5 items-center justify-center rounded-sm bg-success-foreground transition-colors">
					<IconCheck
						className="data-[copied=true]:fade-in-0 data-[copied=true]:slide-in-from-bottom data-[copied=false]:slide-out-to-top data-[copied=false]:fade-out-0 size-4 text-success data-[copied=false]:animate-out data-[copied=true]:animate-in"
						data-copied={isCopied}
					/>
				</div>
			) : (
				<div className="relative inline-flex h-5 w-fit min-w-5">
					<div className="absolute inline-flex h-5 w-fit min-w-5 items-center justify-center group-hover:hidden">
						<IconCopy className={cn("size-4", isCopied && "fade-in-0 slide-in-from-bottom animate-in")} />
					</div>
					<Kbd className="fade-in absolute animate-in group-hover:inline-flex sm:hidden">C</Kbd>
				</div>
			)}
			<span className="hidden sm:block">Copy Link</span>
		</Button>
	);
};
