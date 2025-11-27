import Image from "next/image";

import { useUploadFiles } from "@better-upload/client";
import { formatBytes } from "@better-upload/client/helpers";
import { IconLink, IconX } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { IconEdit } from "@ziron/ui/assets/icons/edit";
import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ziron/ui/components/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";

import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";

import { UPLOAD_ROUTES } from "@/lib/constants/upload";

interface Props {
  className?: string;
  data?: string;
  isOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
}

export const CoverUpload = ({ className, data, isOpen, onOpenChange }: Props) => {
  const form = useFormContext<zCardSchema>();

  const { control } = useUploadFiles({
    route: UPLOAD_ROUTES.cover,
    onUploadComplete: ({ files, metadata }) => {
      form.setValue("cover", (metadata?.url as string) ?? null);
      toast.success("Upload Successful", {
        description: `File: ${files[0]?.raw.name ?? null}, Size: ${formatBytes(files[0]?.raw.size ?? 0)}`,
      });
    },
    onError: (error) => {
      toast.error("Upload Error", { description: error.message });
    },
    onUploadFail: (data) => {
      toast.error("Upload Failed", { description: data.failedFiles[0]?.error.message });
    },
  });

  return (
    <ResponsiveModal
      asChild
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={data ? "Change Cover Image" : "Upload Cover Image"}
      trigger={
        <Button
          className={cn(className, "bg-card/90 text-foreground backdrop-blur-lg hover:bg-card")}
          size="icon"
          type="button"
          variant="secondary"
        >
          <IconEdit className="size-4" /> <span className="sr-only">{data ? "Upload" : "Change"} Cover</span>
        </Button>
      }
    >
      <div className="p-6 pt-0">
        <FormField
          control={form.control}
          name="cover"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  Cover
                  <ButtonGroup>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon-sm" variant="ghost">
                          <IconLink className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Paste an URL to an image</TooltipContent>
                    </Tooltip>
                  </ButtonGroup>
                </FormLabel>
                <FormControl>
                  {field.value ? (
                    <div className="relative flex flex-col gap-2">
                      <Tooltip>
                        <Button
                          className="absolute top-2 right-2 z-10"
                          onClick={() => {
                            form.setValue("cover", undefined);
                          }}
                          size="icon-sm"
                          variant="destructive"
                        >
                          <IconX />
                        </Button>
                      </Tooltip>
                      <Image alt="Cover" className="object-cover" fill src={field.value} />
                    </div>
                  ) : (
                    <UploadDropzoneProgress
                      accept="image/*"
                      control={control}
                      description="Recommended: 1920 x 1080 pixels."
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
    </ResponsiveModal>
  );
};
