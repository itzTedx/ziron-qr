import { useState } from "react";

import { toast } from "sonner";

interface Props {
  timeout?: number;
  onCopy?: () => void;
  customToast?: {
    title?: string;
    description?: string;
  };
}

export function useCopyToClipboard({ timeout = 2000, onCopy, customToast }: Props = {}) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      return;
    }

    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      toast.success(customToast?.title ?? "Copied", {
        description: customToast?.description ?? "Copied to clipboard",
      });

      if (onCopy) {
        onCopy();
      }

      setTimeout(() => {
        setIsCopied(false);
        toast.dismiss();
      }, timeout);
    }, console.error);
  };

  return { isCopied, copyToClipboard };
}
