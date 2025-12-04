import { useState } from "react";

import Image from "next/image";

import { zCardSchema } from "@ziron/validators";

import { CoverUpload } from "./fields/cover-upload";
import { PhotoUploadModal } from "./fields/photo-upload-modal";

interface Props {
  data: Partial<Pick<zCardSchema, "id" | "image" | "cover">>;
}

export const ProfileDashboard = ({ data }: Props) => {
  const [isCoverUploadOpen, setIsCoverUploadOpen] = useState(false);

  return (
    <div>
      <div className="relative h-40 overflow-hidden border-b bg-secondary">
        <div>
          <Image
            alt="cover image"
            className="object-cover transition-[filter] duration-500 hover:brightness-75"
            fill
            priority
            quality={80}
            sizes="100vw"
            src={data.cover ?? "/images/placeholder-cover.jpg"}
            title="Cover Image"
          />
        </div>
        <div className="absolute top-4 left-4 z-10 aspect-square h-32 overflow-hidden rounded-xl border-4 bg-card shadow-lg">
          <Image
            alt="profile image"
            className="object-cover transition-[filter] duration-500 hover:brightness-75"
            fill
            priority
            quality={80}
            sizes="100vw"
            src={data.image ?? "/images/placeholder-profile.jpg"}
          />
          <PhotoUploadModal currentImage={data.image} />
        </div>

        <CoverUpload
          className="absolute top-3 right-4 z-10 flex items-center gap-2"
          coverImage={data.cover}
          isOpen={isCoverUploadOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsCoverUploadOpen(false);
            } else {
              setIsCoverUploadOpen(true);
            }
          }}
        />
      </div>
      {/* <section className="-mt-16 container mx-auto">
        <div className="relative rounded-xl border-background bg-card/80 px-4 py-4 backdrop-blur-xl sm:border sm:px-6 sm:shadow-lg">
          <div className="flex items-center md:px-3 lg:pr-6">
            <div className="group relative size-24 shrink-0">
              <Image
                alt="Profile Image"
                className="overflow-hidden rounded-full border-4 border-background object-cover transition-[filter] group-hover:brightness-90"
                fill
                quality={25}
                sizes="10vw"
                src={data.image ?? "/images/placeholder-cover.jpg"}
              />
              <PhotoUploadModal currentImage={data.image} />
            </div>
            <div className="w-full max-md:mt-3 md:ml-3">
              <div className="flex items-center justify-between gap-3">
                {organization?.name && (
                  <Badge className="gap-1.5" variant="secondary">
                    {organization.name}
                  </Badge>
                )}
                <span className="flex gap-2 text-primary md:hidden">
                  <Button size="icon" type="button" variant="ghost">
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
                    <p>{data && data.name ? data.name : "Untitled Card"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <p className="text-muted-foreground text-sm">
                {data && data.designation ? data.designation : "Designation"}
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};
