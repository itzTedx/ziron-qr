import Image from "next/image";

import { ActionButton } from "@/components/ui/action-button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import {
  IconArrowsMaximize,
  IconCamera,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";

import { Icons } from "@ziron/ui/assets/icons";
import { Badge } from "@ziron/ui/components/badge";
import { Button } from "@ziron/ui/components/button";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";

interface Props {
  isPending: boolean;
}

export const ProfileDashboard = ({ isPending }: Props) => {
  const serverAction = async () => {
    // Simulate a server action
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: false };
  };

  return (
    <div>
      <div className="group bg-secondary relative h-72">
        <Image
          src={"/images/placeholder-cover.jpg"}
          fill
          priority
          sizes="100vw"
          alt="cover image"
          title="Cover Image"
          className="object-cover transition-[filter] group-hover:brightness-90"
          quality={80}
        />
      </div>
      <section className="mx-auto -mt-16 max-w-7xl">
        <div className="border-background bg-background/80 shadow-muted/30 relative grid grid-cols-10 rounded-lg border-t px-6 py-4 backdrop-blur-xl sm:border sm:shadow-lg md:divide-x">
          <div className="col-span-10 flex md:col-span-4 md:px-3 lg:px-6">
            <div className="group absolute left-1/2 size-28 -translate-y-20 max-md:-translate-x-1/2 md:-top-[60%] md:left-5 md:size-36 md:translate-y-[30%]">
              <Image
                src="/images/placeholder-cover.jpg"
                fill
                sizes="10vw"
                alt="Profile Image"
                quality={25}
                className="border-background overflow-clip rounded-full border-4 object-cover transition-[filter] group-hover:brightness-90"
              />
              <ResponsiveModal
                //   isOpen={openPhoto}
                //   closeModal={setOpenPhoto}
                asChild
                title="Update Profile Picture"
                trigger={
                  <Button
                    className="absolute right-1 bottom-1 z-10 flex items-center justify-center rounded-full"
                    variant="outline"
                    size="icon"
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
                <Badge variant="secondary" className="gap-1.5">
                  {/* {data.company && data.company.logo && (
              <Image
              src={data.company.logo}
              height={8}
              width={8}
              alt=""
              />
              )} */}
                  {/* {data.company?.name} */}
                </Badge>
                <span className="text-primary flex gap-2 md:hidden">
                  <Button
                    type="button"
                    //   onClick={() => {
                    //     openPreview();
                    //   }}
                    variant="ghost"
                    size="icon"
                  >
                    <IconArrowsMaximize className="size-5" />
                  </Button>
                  <Button
                    type="button"
                    //   onClick={handleShare}
                    variant="ghost"
                    size="icon"
                  >
                    <IconShare className="size-5" />
                  </Button>
                </span>
              </div>
              <h2 className="text-lg font-semibold lg:text-2xl">
                {/* {data.name} */} Untitled Card
              </h2>
              <p className="text-sm">{/* {data.designation} */} Designation</p>
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    //   handleShare();
                  }}
                  variant="outline"
                  className="hidden items-center gap-1.5 md:flex"
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
              requireAreYouSure
              areYouSureDescription="This action cannot be undone."
              actionButton="Delete"
              variant="destructive"
            >
              <IconTrash className="size-4" />
              Delete
            </ActionButton>

            <Button type="submit" size="lg">
              <LoadingSwap isLoading={isPending}>Save Changes</LoadingSwap>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
