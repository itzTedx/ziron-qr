"use client";

import { memo, useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import CopyButton from "@/components/ui/copy-button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useDebounce } from "@/hooks/debounce";
import {
  IconArrowRight,
  IconArrowsMaximize,
  IconCamera,
  IconCheck,
  IconLoader2,
  IconPhoto,
  IconShare,
  IconX,
} from "@tabler/icons-react";
import {
  Control,
  useFormContext,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import { toast } from "sonner";

import { CardType } from "@ziron/db/schema";
import { Icons } from "@ziron/ui/assets/icons";
import { DeleteIcon } from "@ziron/ui/assets/trash-icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ziron/ui/components/alert-dialog";
import { Badge } from "@ziron/ui/components/badge";
import { Button, buttonVariants } from "@ziron/ui/components/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

// Memoize static sub-components
interface ImageUploadFieldProps {
  control: Control<zCardSchema>;
  setError: UseFormSetError<zCardSchema>;
  setValue: UseFormSetValue<zCardSchema>;
  onSuccess: () => void;
  endpoint: "photo" | "cover";
}

const ImageUploadField = memo(
  ({
    control,
    setError,
    setValue,
    onSuccess,
    endpoint,
  }: ImageUploadFieldProps) => (
    <FormField
      control={control}
      name="image"
      render={() => (
        <FormItem className="px-6 pb-6">
          <FormLabel>
            Change {endpoint === "photo" ? "Profile Picture" : "Cover Image"}
          </FormLabel>
          <FormControl>
            {/* <UploadDropzone
              endpoint={endpoint}
              onUploadBegin={() => toast.loading("Uploading...")}
              onUploadError={(error) => {
                setError(endpoint === "photo" ? "image" : "cover", {
                  type: "validate",
                  message: error.message,
                });
              }}
              onClientUploadComplete={(res) => {
                setValue(endpoint === "photo" ? "image" : "cover", res[0].url);
                toast.dismiss();
                toast.success("Upload complete");
                onSuccess();
              }}
              config={{ mode: "auto" }}
            /> */}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
);
ImageUploadField.displayName = "ImageUploadField";

interface ProfileDashboardProps {
  data: CardType;
  loading: boolean;
}

export default function ProfileDashboard({
  data,
  loading,
}: ProfileDashboardProps) {
  const [openPhoto, setOpenPhoto] = useState(false);
  const [openCover, setOpenCover] = useState(false);
  const [openSlug, setOpenSlug] = useState(false);
  const [slug, setSlug] = useState(data.slug);
  const [isSlugValid, setIsSlugValid] = useState(true);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const router = useRouter();
  const shareLink = `${process.env.NEXT_PUBLIC_BASE_PATH}/${data.slug}`;

  const { setValue, control, setError, clearErrors } =
    useFormContext<zCardSchema>();

  // const openModal = useShareModalStore((state) => state.openModal);
  // const openPreview = usePreviewModalStore((state) => state.onOpenChange);

  // Memoize handlers
  const handleShare = useCallback(() => {
    const shareData = {
      url: shareLink,
      name: data.name,
      logo: data.company?.logo || undefined,
    };
    // openModal(shareData, data.name);
  }, [shareLink, data.name, data.company?.logo]);

  // const { execute: deleteExistingCard } = useAction(deleteCard, {
  //   onSuccess: ({ data: existingCard }) => {
  //     if (existingCard?.success) {
  //       router.push("/");
  //       toast.success(existingCard.success);
  //     }
  //     if (existingCard?.error) toast.error(existingCard.error);
  //   },
  // });

  // const handleDelete = useCallback(() => {
  //   if (data.id) {
  //     deleteExistingCard({ id: data.id });
  //   }
  // }, [data.id, deleteExistingCard]);

  // Create debounced check function
  const debouncedCheck = useCallback(
    useDebounce(async (value: string) => {
      // const result = await checkURLAvailability(value);
      setIsCheckingSlug(false);
      // setIsSlugValid(result?.success ?? false);

      // if (!result?.success) {
      //   setError("slug", {
      //     type: "validate",
      //     message: result?.message || "Invalid url",
      //   });
      // } else {
      //   setValue("slug", value);
      //   clearErrors("slug");
      // }
    }, 500),
    [setError, setValue, clearErrors],
  );

  const handleSlugChange = useCallback(
    (value: string) => {
      setSlug(value);
      if (!value) {
        setIsSlugValid(false);
        setError("slug", {
          type: "validate",
          message: "Slug cannot be empty",
        });
        return;
      }

      setIsCheckingSlug(true);
      debouncedCheck(value);
    },
    [setError, debouncedCheck],
  );

  const handleSlugSave = useCallback(() => {
    if (isSlugValid && slug && data.id) {
      setValue("slug", slug);
      setOpenSlug(false);
      // updateSlug(slug, data.id);
      toast.success("URL updated successfully");
    }
  }, [isSlugValid, slug, setValue]);

  const customizeUrlModal = (
    <ResponsiveModal
      isOpen={openSlug}
      closeModal={setOpenSlug}
      title="Customize URL"
      trigger={
        <Button
          className="flex h-auto items-center justify-center gap-1.5 rounded-full px-0 py-0"
          variant="link"
          type="button"
        >
          Customize URL <IconArrowRight className="size-5" />
        </Button>
      }
    >
      <FormField
        control={control}
        name="slug"
        render={() => (
          <FormItem className="px-6 pb-2">
            <FormLabel className="sr-only">Custom URL</FormLabel>
            <FormControl>
              <div
                className={cn(
                  "flex rounded-md shadow-xs focus-within:ring-2 focus-within:ring-offset-2",
                  isCheckingSlug
                    ? "focus-within:ring-muted"
                    : isSlugValid
                      ? "focus-within:ring-green-600"
                      : "focus-within:ring-destructive",
                )}
              >
                <span className="border-input bg-background text-muted-foreground inline-flex items-center rounded-s-md border px-3 text-sm">
                  {process.env.NEXT_PUBLIC_BASE_PATH}/
                </span>
                <div className="relative flex-1">
                  <Input
                    value={slug ?? ""}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="focus-visible:ring-ring -ms-px rounded-s-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="(optional)"
                    type="text"
                  />
                  {isCheckingSlug && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <IconLoader2 className="text-muted-foreground size-4 animate-spin" />
                    </div>
                  )}
                  {isCheckingSlug ? null : isSlugValid ? (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <IconCheck className="size-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <IconX className="text-destructive size-4" />
                    </div>
                  )}
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex justify-end gap-2 px-6 pb-6">
        <Button variant="outline" onClick={() => setOpenSlug(false)}>
          Cancel
        </Button>
        <Button onClick={handleSlugSave} disabled={!isSlugValid}>
          Save
        </Button>
      </div>
    </ResponsiveModal>
  );

  return (
    <section>
      <div className="group bg-secondary relative h-72">
        <Image
          src={data.cover!}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          alt="cover image"
          title="Cover Image"
          className="object-cover transition-[filter] group-hover:brightness-90"
          quality={60}
        />

        <ResponsiveModal
          isOpen={openCover}
          asChild
          closeModal={setOpenCover}
          title="Update Cover Image"
          trigger={
            <Button
              className="bg-background/70 absolute top-20 right-3 z-10 flex size-12 items-center justify-center gap-2 rounded-full backdrop-blur-md sm:top-1/2 sm:left-1/2 sm:size-auto sm:w-fit sm:-translate-x-1/2 sm:-translate-y-1/2"
              variant="outline"
            >
              <IconPhoto className="size-5 shrink-0" />
              <span className="hidden sm:block">Change Cover</span>
            </Button>
          }
        >
          Hello
          {/* <ImageUploadField
            control={control}
            setError={setError}
            setValue={setValue}
            onSuccess={() => setOpenCover(false)}
            endpoint="cover"
          /> */}
        </ResponsiveModal>
      </div>
      <div className="border-background bg-background/80 shadow-muted/30 relative container -mt-16 grid max-w-7xl grid-cols-10 rounded-lg border-t py-4 backdrop-blur-xl sm:border sm:shadow-lg md:divide-x">
        <div className="col-span-10 flex md:col-span-4 md:px-3 lg:px-6">
          <div className="group absolute left-1/2 size-28 -translate-y-20 max-md:-translate-x-1/2 md:-top-[60%] md:left-5 md:size-36 md:translate-y-[30%]">
            <Image
              src={data.image!}
              fill
              sizes="10vw"
              alt="Profile Image"
              quality={25}
              className="border-background overflow-clip rounded-full border-4 object-cover transition-[filter] group-hover:brightness-90"
            />
            <ResponsiveModal
              isOpen={openPhoto}
              closeModal={setOpenPhoto}
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
                {data.company && data.company.logo && (
                  <Image src={data.company.logo} height={8} width={8} alt="" />
                )}
                {data.company?.name}
              </Badge>
              <span className="text-primary flex gap-2 md:hidden">
                <Button
                  type="button"
                  // onClick={() => {
                  //   openPreview();
                  // }}
                  variant="ghost"
                  size="icon"
                >
                  <IconArrowsMaximize className="size-5" />
                </Button>
                <Button
                  type="button"
                  onClick={handleShare}
                  variant="ghost"
                  size="icon"
                >
                  <IconShare className="size-5" />
                </Button>
              </span>
            </div>
            <h2 className="text-lg font-semibold lg:text-2xl">{data.name}</h2>
            <p className="text-sm">{data.designation}</p>
          </div>
        </div>

        <div className="col-span-10 flex items-center justify-between gap-4 md:col-span-4 md:px-3 lg:px-6">
          <div className="w-full space-y-2 max-md:hidden">
            <div className="flex items-center justify-between">
              <h3 className="max-md:text-xs">Link</h3>
              {customizeUrlModal}
            </div>
            <div className="flex items-center gap-2">
              <CopyButton link={shareLink} />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleShare();
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-destructive bg-destructive/50 text-foreground hover:bg-destructive/40"
              >
                <DeleteIcon className="size-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  card.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  // onClick={handleDelete}
                >
                  Yes, I&apos;m sure
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit" disabled={loading}>
            Save Changes
          </Button>
        </div>
      </div>
    </section>
  );
}
