import { useState } from "react";

import Image from "next/image";

import { IconArrowsMaximize, IconShare } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";

import { Badge } from "@ziron/ui/components/badge";
import { Button } from "@ziron/ui/components/button";
import { Kbd, KbdGroup } from "@ziron/ui/components/kbd";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ziron/ui/components/tooltip";
import { useHotkey } from "@ziron/ui/hooks/use-hotkey";

import { zCardSchema } from "@ziron/validators";

import { DeleteCard } from "./delete-card";
import { CoverUpload } from "./fields/cover-upload";
import { PhotoUploadModal } from "./fields/photo-upload-modal";
import { SlugField } from "./fields/slug-field";

interface Props {
  isPending: boolean;
  data: Partial<Pick<zCardSchema, "id" | "name" | "designation" | "slug" | "image" | "cover">>;
  companyName?: string;
  companyId?: string;
}

export const ProfileDashboard = ({ isPending, companyName, data, companyId }: Props) => {
  const form = useFormContext<zCardSchema>();
  const [isCoverUploadOpen, setIsCoverUploadOpen] = useState(false);

  // Handle Ctrl+S keyboard shortcut
  useHotkey({
    combos: [
      { key: "s", ctrl: true },
      { key: "s", meta: true },
    ],

    enabled: true,
    condition: () => !form.formState.isSubmitting,
    callback: () => {
      form.trigger();
    },
    throttleMs: 300,
  });

  return (
    <div className="p-1">
      <div
        className="group relative h-48 overflow-hidden border-b bg-secondary"
        onClick={() => setIsCoverUploadOpen(true)}
        role="button"
      >
        <Image
          alt="cover image"
          className="object-cover transition-[filter] group-hover:brightness-75"
          fill
          priority
          quality={80}
          sizes="100vw"
          src={data.cover ?? "/images/placeholder-cover.jpg"}
          title="Cover Image"
        />

        <CoverUpload
          className="absolute top-3 right-4 z-10 flex items-center gap-2"
          data={data.cover}
          isOpen={isCoverUploadOpen}
          onOpenChange={setIsCoverUploadOpen}
        />
      </div>
      <section className="-mt-16 container mx-auto">
        <div className="relative grid grid-cols-10 rounded-lg border-background border-t bg-background/80 px-6 py-4 shadow-muted/30 backdrop-blur-xl sm:border sm:shadow-lg md:grid-cols-12 md:divide-x">
          <div className="col-span-10 flex items-center md:col-span-5 md:px-3 lg:pr-6">
            <div className="group relative size-24 shrink-0">
              <Image
                alt="Profile Image"
                className="overflow-clip rounded-full border-4 border-background object-cover transition-[filter] group-hover:brightness-90"
                fill
                quality={25}
                sizes="10vw"
                src={data.image ?? "/images/placeholder-cover.jpg"}
              />
              <PhotoUploadModal currentImage={data.image} />
            </div>
            <div className="w-full max-md:mt-3 md:ml-3">
              <div className="flex items-center justify-between gap-3">
                {companyName && (
                  <Badge className="gap-1.5" variant="secondary">
                    {companyName}
                  </Badge>
                )}
                <span className="flex gap-2 text-primary md:hidden">
                  <Button
                    size="icon"
                    //   onClick={() => {
                    //     openPreview();
                    //   }}
                    type="button"
                    variant="ghost"
                  >
                    <IconArrowsMaximize className="size-5" />
                  </Button>
                  <Button
                    size="icon"
                    //   onClick={handleShare}
                    type="button"
                    variant="ghost"
                  >
                    <IconShare className="size-5" />
                  </Button>
                </span>
              </div>
              <TooltipProvider delayDuration={1000}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h2 className="line-clamp-1 w-fit font-semibold text-lg lg:text-2xl">
                      {data && data.name ? data.name : "Untitled Card"}
                    </h2>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-muted-foreground text-sm">{data && data.name ? data.name : "Untitled Card"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <p className="text-muted-foreground text-sm">
                {data && data.designation ? data.designation : "Designation"}
              </p>
            </div>
          </div>

          <div className="col-span-10 flex items-center justify-between gap-4 md:col-span-5 md:px-3 lg:px-6">
            <SlugField companyId={companyId} data={data} />
          </div>

          <div className="col-span-2 hidden flex-col items-center gap-3 px-6 md:flex">
            {data.id && <DeleteCard id={data.id} />}

            <Button className="w-full" size="lg" type="submit">
              <LoadingSwap className="flex items-center gap-1.5" isLoading={isPending}>
                Save
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>S</Kbd>
                </KbdGroup>
              </LoadingSwap>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
