"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import { Kbd } from "@ziron/ui/components/kbd";
import { useCopyToClipboard } from "@ziron/ui/hooks/use-copy-to-clipboard";
import { useHotkey } from "@ziron/ui/hooks/use-hotkey";

import { cn } from "@ziron/utils";

import { env } from "@/lib/env/client";

export const CopyLinkButton = ({ slug }: { slug?: string | null }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  function handleCopyLink() {
    if (!slug) return;
    copyToClipboard(`${env.NEXT_PUBLIC_CLIENT_URL}/${slug}`);
  }

  useHotkey({
    combos: [{ key: "c" }],
    enabled: true,
    callback: handleCopyLink,
  });

  if (!slug) return null;

  return (
    <Button
      className="group font-medium max-md:size-8 md:pl-2"
      onClick={handleCopyLink}
      size="sm"
      type="button"
      variant="outline"
    >
      {isCopied ? (
        <div className="inline-flex h-5 w-fit min-w-5 items-center justify-center rounded-sm bg-success-foreground transition-colors group-hover:hidden">
          <IconCheck className="fade-in-0 slide-in-from-bottom slide-out-to-top size-4 animate-in text-success" />
        </div>
      ) : (
        <>
          <div className="inline-flex h-5 w-fit min-w-5 items-center justify-center group-hover:hidden">
            <IconCopy className={cn("size-4", isCopied && "fade-in-0 slide-in-from-bottom animate-in")} />
          </div>
          <Kbd className="hidden group-hover:inline-flex">C</Kbd>
        </>
      )}
      <span className="hidden sm:block">Copy Link</span>
    </Button>
  );
};
