"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@ziron/ui/components/button";
import { useCopyToClipboard } from "@ziron/ui/hooks/use-copy-to-clipboard";
import { cn } from "@ziron/utils";

const CopyButton = ({ link }: { link: string }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between overflow-hidden rounded-full border border-input bg-background p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:outline-none active:ring-2 active:ring-ring active:ring-offset-2"
      )}
    >
      <p className="overflow-hidden truncate text-ellipsis whitespace-nowrap pr-2 pl-2 text-[10px] md:pl-4 md:text-sm lg:max-w-[30ch]">
        {link}
      </p>
      <Button
        className="shrink-0 rounded-full bg-foreground text-background *:size-4 hover:bg-foreground/80"
        onClick={() => copyToClipboard(link)}
        size="icon"
        type="button"
      >
        {isCopied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

export default CopyButton;
