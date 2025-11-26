"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import { Kbd } from "@ziron/ui/components/kbd";
import { useCopyToClipboard } from "@ziron/ui/hooks/use-copy-to-clipboard";
import { useHotkey } from "@ziron/ui/hooks/use-hotkey";

import { env } from "@/lib/env/client";

export const CopyLinkButton = ({ slug }: { slug?: string }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  function handleCopyLink() {
    copyToClipboard(`${env.NEXT_PUBLIC_CLIENT_URL}/${slug}`);
  }

  useHotkey({
    combos: [{ key: "c" }],
    enabled: true,
    callback: handleCopyLink,
  });

  return (
    <Button
      className="font-medium"
      disabled={isCopied}
      onClick={handleCopyLink}
      size="sm"
      type="button"
      variant="outline"
    >
      {isCopied ? <IconCheck /> : <IconCopy />}
      Copy Link <Kbd>C</Kbd>
    </Button>
  );
};
