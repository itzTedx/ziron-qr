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
        "border-input bg-background focus-visible:ring-ring active:ring-ring flex w-full items-center justify-between overflow-hidden rounded-full border p-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:ring-2 active:ring-offset-2 active:outline-none",
      )}
    >
      <p className="truncate overflow-hidden pr-2 pl-2 text-[10px] text-ellipsis whitespace-nowrap md:pl-4 md:text-sm lg:max-w-[30ch]">
        {link}
      </p>
      <Button
        size="icon"
        className="bg-foreground text-background hover:bg-foreground/80 shrink-0 rounded-full *:size-4"
        onClick={() => copyToClipboard(link)}
        type="button"
      >
        {isCopied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

export default CopyButton;
