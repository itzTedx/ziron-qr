import Image from "next/image";

import { IconArrowsMaximize, IconShare } from "@tabler/icons-react";

import { Badge } from "@ziron/ui/components/badge";
import { Button } from "@ziron/ui/components/button";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ziron/ui/components/tooltip";
import { zCardSchema } from "@ziron/validators";

import { DeleteCard } from "./delete-card";
import { PhotoUploadModal } from "./fields/photo-upload-modal";
import { SlugField } from "./fields/slug-field";

interface Props {
  isPending: boolean;
  data: Partial<Pick<zCardSchema, "id" | "name" | "designation" | "slug" | "image" | "cover">>;
  companyName?: string;
  company?: { logo: string | null; name: string };
}

export const ProfileDashboard = ({ isPending, companyName, data, company }: Props) => {
  return (
    <div>
      <div className="group relative h-72 bg-secondary">
        <Image
          alt="cover image"
          className="object-cover transition-[filter] group-hover:brightness-90"
          fill
          priority
          quality={80}
          sizes="100vw"
          src={"/images/placeholder-cover.jpg"}
          title="Cover Image"
        />
      </div>
      <section className="-mt-16 mx-auto max-w-7xl">
        <div className="relative grid grid-cols-10 rounded-lg border-background border-t bg-background/80 px-6 py-4 shadow-muted/30 backdrop-blur-xl sm:border sm:shadow-lg md:grid-cols-12 md:divide-x">
          <div className="col-span-10 flex md:col-span-5 md:px-3 lg:pr-6">
            <div className="group relative aspect-square h-full">
              <Image
                alt="Profile Image"
                className="overflow-clip rounded-full border-4 border-background object-cover transition-[filter] group-hover:brightness-90"
                fill
                quality={25}
                sizes="10vw"
                src={data.image ?? "/images/placeholder-cover.jpg"}
              />
              <PhotoUploadModal />
            </div>
            <div className="w-full max-md:mt-3 md:ml-3">
              <div className="flex items-center justify-between gap-3">
                <Badge className="gap-1.5" variant="secondary">
                  {companyName}
                </Badge>
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
            <SlugField company={company} data={data} />
          </div>

          <div className="col-span-2 hidden flex-col items-center gap-3 px-6 md:flex">
            {data.id && <DeleteCard id={data.id} />}

            <Button className="w-full" size="lg" type="submit">
              <LoadingSwap isLoading={isPending}>Save Changes</LoadingSwap>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
