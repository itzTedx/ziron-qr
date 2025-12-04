"use client";

import { PropsWithChildren, ReactNode, useMemo, useRef, useState } from "react";

import { IconCheck, IconDownload, IconInfoCircle, IconPhoto } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { Icons } from "@ziron/ui/assets/icons";
import { Button } from "@ziron/ui/components/button";
import { Label } from "@ziron/ui/components/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";

import { QRCode } from "@/components/ui/qr-code";
import { ResponsivePopover } from "@/components/ui/responsive-popover";
import { ShimmerDots } from "@/components/ui/shimmer-dots";
import { Switch } from "@/components/ui/switch";

import { getQRAsCanvas, getQRAsSVGDataUri, getQRData } from "@/lib/qr";

// Import the new function

interface QRCodeDownloadProps {
  data: { url: string; name: string; logo?: string };
}

export default function QRCodeDownload({ data }: QRCodeDownloadProps) {
  const [checked, setChecked] = useState<boolean>(true);

  const qrData = useMemo(
    () =>
      getQRData({
        url: data.url || "",
        fgColor: "#000",
        hideLogo: checked,
        logo: data.logo,
      }),
    [data, checked]
  );

  return (
    <div className="space-y-3 px-3 pb-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 font-medium text-sm">
          QR Code Preview
          {/* <InfoTooltip content={<SimpleTooltipContent title="Customize your QR code to fit your brand." />} /> */}
        </Label>
        <div className="flex items-center gap-2">
          <DownloadPopover props={data.name} qrData={qrData}>
            <Button size="icon-sm" type="button" variant="outline">
              <IconDownload className="size-4 shrink-0" />
            </Button>
          </DownloadPopover>
          <CopyQrButton qrData={qrData} />
        </div>
      </div>
      <div className="relative flex items-center justify-center gap-6 rounded-lg border bg-card p-4 dark:bg-muted/20">
        <ShimmerDots className="mask-[radial-gradient(40%_80%,transparent_50%,black)] opacity-50 dark:opacity-30" />
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ filter: "blur(0px)", opacity: 1 }}
            className="relative flex size-full items-center justify-center"
            exit={{ filter: "blur(2px)", opacity: 0.4 }}
            initial={{ filter: "blur(2px)", opacity: 0.4 }}
            transition={{ duration: 0.1 }}
          >
            <QRCode className="rounded-md dark:invert" hideLogo={checked} logo={data.logo} scale={2} url={data.url} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 font-medium text-sm" htmlFor="logo">
          Logo
          <Tooltip>
            <TooltipTrigger>
              <IconInfoCircle className="size-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Display your logo in the center of the QR code</TooltipContent>
          </Tooltip>
        </Label>

        <div className="flex items-center justify-end">
          <Switch checked={checked} id="logo" onCheckedChange={setChecked} />
        </div>
      </div>
    </div>
  );
}

function DownloadPopover({
  qrData,
  props,
  children,
}: PropsWithChildren<{
  qrData: ReturnType<typeof getQRData>;
  props: string;
}>) {
  const anchorRef = useRef<HTMLAnchorElement>(null);

  function download(url: string, extension: string) {
    if (!anchorRef.current) return;
    anchorRef.current.href = url;
    anchorRef.current.download = `${props}-qrcode.${extension}`;
    anchorRef.current.click();
    setOpenPopover(false);
  }

  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div>
      <ResponsivePopover
        content={
          <div className="grid text-foreground">
            <button
              className="w-full cursor-pointer rounded-md p-2 text-left font-medium text-sm outline-none transition-all duration-75 hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={async () => {
                download(await getQRAsSVGDataUri(qrData), "svg");
              }}
              type="button"
            >
              <IconMenu icon={<Icons.svg className="size-5" />} text="Download SVG" />
            </button>
            <button
              className="w-full cursor-pointer rounded-md p-2 text-left font-medium text-sm outline-none transition-all duration-75 hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={async () => {
                download((await getQRAsCanvas(qrData, "image/png")) as string, "png");
              }}
              type="button"
            >
              <IconMenu icon={<Icons.png className="size-5" />} text="Download PNG" />
            </button>
            <button
              className="w-full cursor-pointer rounded-md p-2 text-left font-medium text-sm outline-none transition-all duration-75 hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={async () => {
                download((await getQRAsCanvas(qrData, "image/jpeg")) as string, "jpg");
              }}
              type="button"
            >
              <IconMenu icon={<Icons.jpg className="size-5" />} text="Download JPEG" />
            </button>
          </div>
        }
        openPopover={openPopover}
        popoverContentClassName="p-1.5"
        setOpenPopover={setOpenPopover}
      >
        {children}
      </ResponsivePopover>
      {/* This will be used to prompt downloads. */}
      <a className="hidden" download={`${props}-qrcode.svg`} ref={anchorRef} />
    </div>
  );
}

function CopyQrButton({ qrData }: { qrData: ReturnType<typeof getQRData> }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyImageToClipboard = async () => {
    try {
      const canvas = await getQRAsCanvas(qrData, "image/png", true);
      if (canvas instanceof HTMLCanvasElement) {
        canvas.toBlob(async (blob) => {
          if (blob && typeof window !== "undefined" && navigator.clipboard.write) {
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
            setIsCopied(true);
            toast.success("Copied QR code to clipboard!");

            setTimeout(() => {
              setIsCopied(false);
              toast.dismiss();
            }, 2000);
          }
        });
      }
    } catch (e) {
      throw e;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={async () => {
            toast.promise(copyImageToClipboard, {
              loading: "Copying QR code to clipboard...",
              success: "Copied QR code to clipboard!",
              error: "Failed to copy",
            });
          }}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          {isCopied ? <IconCheck className="size-4" /> : <IconPhoto className="size-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy QR code to clipboard</TooltipContent>
    </Tooltip>
  );
}

interface MenuIconProps {
  icon: ReactNode;
  text: string;
}

function IconMenu({ icon, text }: MenuIconProps) {
  return (
    <div className="flex items-center justify-start space-x-2 truncate">
      {icon}
      <p className="truncate text-sm">{text}</p>
    </div>
  );
}
