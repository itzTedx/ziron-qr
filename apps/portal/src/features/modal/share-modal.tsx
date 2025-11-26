"use client";

import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { IconExternalLink } from "@tabler/icons-react";
import { useAtomValue, useSetAtom } from "jotai";

import { Button } from "@ziron/ui/components/button";
import { Label } from "@ziron/ui/components/label";

import { CopyButton } from "@/components/ui/copy-button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Tilt, TiltContent } from "@/components/ui/tilt";

import { closeShareModalAtom, shareModalAtom } from "../company/atom";
import QRCodeDownload from "./components/qr-download";

export const ShareModal = () => {
  const modalState = useAtomValue(shareModalAtom);
  const closeModal = useSetAtom(closeShareModalAtom);

  const handleClose = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  if (!modalState.data) {
    return null;
  }

  const { data } = modalState.data;

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(data.url);
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
    <ResponsiveModal
      className="gap-0 sm:max-w-4xl"
      closeModal={handleClose}
      isOpen={modalState.open}
      title="Share digital card"
    >
      <div className="grid grid-cols-7">
        <Tilt className="col-span-3 m-6 space-y-3" perspective={1200}>
          <TiltContent asChild>
            <div className="flex aspect-3/4 flex-col justify-between gap-2 rounded-lg border bg-linear-45 from-primary to-brand-secondary p-6">
              {data.company.logo ? (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-sm border bg-white p-2">
                  <Image
                    alt={`${data.name}'s Logo`}
                    className="size-8 object-contain"
                    height={48}
                    src={data.company.logo}
                    width={48}
                  />
                </div>
              ) : (
                <p>{data.company.name}</p>
              )}
              <div className="flex items-center justify-center">
                <Image
                  alt={`${data.name}'s Photo`}
                  className="rounded-full"
                  height={120}
                  src={data.image}
                  width={120}
                />
              </div>
              <div>
                <h2 className="truncate font-bold text-xl">{data.name}</h2>
                <p className="text-foreground/80 text-sm">{data.designation}</p>
              </div>
            </div>
          </TiltContent>
        </Tilt>

        <div className="col-span-4 flex flex-col gap-6 border-l p-6">
          <QRCodeDownload
            data={{
              name: data.name,
              url: data.url,
              logo: data.company.logo ?? undefined,
            }}
          />

          {/* Copy Link */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Link</Label>

              <Link
                className="flex items-center gap-1.5 text-muted-foreground text-xs hover:underline"
                href={data.url as Route}
                target="_blank"
              >
                Open in new tab
                <IconExternalLink className="size-3" />
              </Link>
            </div>
            <CopyButton link={data.url} />
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
    </ResponsiveModal>
  );
};
