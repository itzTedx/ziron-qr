"use client";

import { Check, Copy, Link } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@ziron/ui/components/input-group";
import { useCopyToClipboard } from "@ziron/ui/hooks/use-copy-to-clipboard";

export const CopyButton = ({ link }: { link: string }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <InputGroup>
      <InputGroupAddon>
        <Link />
      </InputGroupAddon>
      <InputGroupInput readOnly value={link} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={() => copyToClipboard(link)}>{isCopied ? <Check /> : <Copy />}</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
