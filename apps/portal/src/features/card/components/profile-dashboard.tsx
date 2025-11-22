import Image from "next/image";

import { IconArrowsMaximize, IconCamera, IconShare, IconTrash } from "@tabler/icons-react";

import { Icons } from "@ziron/ui/assets/icons";
import { Badge } from "@ziron/ui/components/badge";
import { Button } from "@ziron/ui/components/button";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { zCardSchema } from "@ziron/validators";

import { ActionButton } from "@/components/ui/action-button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";

interface Props {
  isPending: boolean;
  data: Partial<Pick<zCardSchema, "name" | "designation" | "slug" | "image" | "cover">>;
  companyName?: string;
}

export const ProfileDashboard = ({ isPending, companyName, data }: Props) => {
  const serverAction = async () => {
    // Simulate a server action
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: false };
  };

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
        <div className="relative grid grid-cols-10 rounded-lg border-background border-t bg-background/80 px-6 py-4 shadow-muted/30 backdrop-blur-xl sm:border sm:shadow-lg md:divide-x">
          <div className="col-span-10 flex md:col-span-4 md:px-3 lg:px-6">
            <div className="group -translate-y-20 max-md:-translate-x-1/2 md:-top-[60%] absolute left-1/2 size-28 md:left-5 md:size-36 md:translate-y-[30%]">
              <Image
                alt="Profile Image"
                className="overflow-clip rounded-full border-4 border-background object-cover transition-[filter] group-hover:brightness-90"
                fill
                quality={25}
                sizes="10vw"
                src="/images/placeholder-cover.jpg"
              />
              <ResponsiveModal
                //   isOpen={openPhoto}
                //   closeModal={setOpenPhoto}
                asChild
                title="Update Profile Picture"
                trigger={
                  <Button
                    className="absolute right-1 bottom-1 z-10 flex items-center justify-center rounded-full"
                    size="icon"
                    variant="outline"
                  >
                    <IconCamera className="size-5" />
                  </Button>
                }
              >
                Hello
                {/* <ImageUploadField
            control={control}
            setError={setError}
            setValue={setValue}
            onSuccess={() => setOpenPhoto(false)}
            endpoint="photo"
            /> */}
              </ResponsiveModal>
            </div>
            <div className="w-full max-md:mt-3 md:ml-36">
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
              <h2 className="font-semibold text-lg lg:text-2xl">{data && data.name ? data.name : "Untitled Card"}</h2>
              <p className="text-muted-foreground text-sm">
                {data && data.designation ? data.designation : "Designation"}
              </p>
            </div>
          </div>

          <div className="col-span-10 flex items-center justify-between gap-4 md:col-span-4 md:px-3 lg:px-6">
            <div className="w-full space-y-2 max-md:hidden">
              <div className="flex items-center justify-between">
                <h3 className="max-md:text-xs">Link</h3>
                {/* {customizeUrlModal} */}
              </div>
              <div className="flex items-center gap-2">
                {/* <CopyButton link={shareLink} /> */}
                <Button
                  className="hidden items-center gap-1.5 md:flex"
                  onClick={(e) => {
                    e.preventDefault();
                    //   handleShare();
                  }}
                  type="button"
                  variant="outline"
                >
                  <Icons.share className="size-4 stroke-[1.5]" />
                  <span className="hidden lg:block">Share</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="col-span-2 hidden flex-col gap-3 px-6 md:flex">
            <ActionButton
              action={serverAction}
              actionButton="Delete"
              areYouSureDescription="This action cannot be undone."
              requireAreYouSure
              variant="destructive"
            >
              <IconTrash className="size-4" />
              Delete
            </ActionButton>

            <Button size="lg" type="submit">
              <LoadingSwap isLoading={isPending}>Save Changes</LoadingSwap>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
