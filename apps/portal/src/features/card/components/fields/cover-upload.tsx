import { useEffect, useState } from "react";

import Image from "next/image";

import { useUploadFiles } from "@better-upload/client";
import { formatBytes } from "@better-upload/client/helpers";
import { IconLink } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { IconUnsplash } from "@ziron/ui/assets/icons/brands";
import { IconEdit } from "@ziron/ui/assets/icons/edit";
import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ziron/ui/components/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";

import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";

import { UPLOAD_ROUTES } from "@/lib/constants/upload";

interface Props {
  className?: string;
  coverImage?: string;
  isOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
}

export const CoverUpload = ({ className, coverImage, isOpen, onOpenChange }: Props) => {
  const form = useFormContext<zCardSchema>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { control, upload } = useUploadFiles({
    route: UPLOAD_ROUTES.cover,
    onUploadBegin: () => {
      toast.loading("Uploading cover image...");
    },
    onUploadSettle: () => {
      toast.dismiss();
    },
    onUploadComplete: ({ files, metadata }) => {
      toast.success("Upload Successful", {
        description: `File: ${files[0]?.raw.name ?? null}, Size: ${formatBytes(files[0]?.raw.size ?? 0)}`,
      });
      form.setValue("cover", (metadata?.url as string) ?? null);
      toast.success("Upload Successful", {
        description: `File: ${files[0]?.raw.name ?? null}, Size: ${formatBytes(files[0]?.raw.size ?? 0)}`,
      });
      // Clean up preview URL after successful upload
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedFile(null);
      onOpenChange?.(false);
    },
    onError: (error) => {
      toast.error("Upload Error", { description: error.message });
    },
    onUploadFail: (data) => {
      toast.error("Upload Failed", { description: data.failedFiles[0]?.error.message });
    },
  });

  // Clean up object URL on unmount or when modal closes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [isOpen, previewUrl]);

  const handleSave = () => {
    if (selectedFile) {
      upload([selectedFile]);
    }
  };

  const isDirty = selectedFile !== null || form.formState.dirtyFields.cover === true;

  return (
    <ResponsiveModal onOpenChange={onOpenChange} open={isOpen}>
      <ResponsiveModalTrigger asChild>
        <Button
          className={cn(className, "bg-card/90 text-foreground backdrop-blur-lg hover:bg-card")}
          size="icon"
          type="button"
          variant="secondary"
        >
          <IconEdit className="size-4" /> <span className="sr-only">{coverImage ? "Upload" : "Change"} Cover</span>
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="sm:max-w-xl">
        <ResponsiveModalHeader className="border-b-0">
          <ResponsiveModalTitle>{coverImage ? "Change Cover Image" : "Upload Cover Image"}</ResponsiveModalTitle>
        </ResponsiveModalHeader>
        <div className="bg-card p-6 pt-0">
          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    Cover
                    <div className="inline-flex gap-2">
                      <ButtonGroup>
                        <ButtonGroup>
                          <Button
                            onClick={() => {
                              form.setValue("cover", undefined);
                            }}
                            size="sm"
                            variant="ghost"
                          >
                            Remove
                          </Button>
                        </ButtonGroup>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon-sm" variant="ghost">
                              <IconLink className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Paste an URL to an image</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon-sm" variant="ghost">
                              <IconUnsplash className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Paste an URL to an image</TooltipContent>
                        </Tooltip>
                      </ButtonGroup>
                    </div>
                  </FormLabel>
                  <FormControl>
                    {previewUrl ? (
                      <div className="relative flex aspect-video flex-col gap-2 overflow-hidden rounded-md border shadow-lg">
                        <Image alt="Cover preview" className="object-cover" fill src={previewUrl} />
                      </div>
                    ) : coverImage ? (
                      <div className="relative flex aspect-video flex-col gap-2 overflow-hidden rounded-md border shadow-lg">
                        <Image alt="Cover" className="object-cover" fill src={coverImage} />
                      </div>
                    ) : (
                      <UploadDropzoneProgress
                        accept="image/*"
                        control={control}
                        description="Recommended: 1920 x 1080 pixels."
                        uploadOverride={(files) => {
                          const file = Array.isArray(files) ? files[0] : files[0];
                          if (file) {
                            const objectUrl = URL.createObjectURL(file);
                            setSelectedFile(file);
                            setPreviewUrl(objectUrl);
                            field.onChange(null);
                          }
                        }}
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <ResponsiveModalFooter>
          <Button
            onClick={() => {
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
              }
              setPreviewUrl(null);
              setSelectedFile(null);
              onOpenChange?.(false);
            }}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={!isDirty} onClick={handleSave} type="button">
            Save changes
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
