import { useState } from "react";

import { useUploadFiles } from "@better-upload/client";
import { formatBytes } from "@better-upload/client/helpers";
import { IconCamera, IconLink } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ziron/ui/components/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";
import { zCardSchema } from "@ziron/validators";

import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";

import { UPLOAD_ROUTES } from "@/lib/constants/upload";

export const PhotoUploadModal = () => {
  const form = useFormContext<zCardSchema>();
  const [isOpen, setIsOpen] = useState(false);

  const { control } = useUploadFiles({
    route: UPLOAD_ROUTES.photo,
    onError: (error) => {
      toast.error("Upload Error", { description: error.message });
    },
    onUploadFail: (data) => {
      toast.error("Upload Failed", { description: data.failedFiles[0]?.error.message });
    },
    onUploadComplete: ({ files, metadata }) => {
      form.setValue("image", (metadata?.url as string) ?? null);
      toast.success("Upload Successful", {
        description: `File: ${files[0]?.raw.name ?? null}, Size: ${formatBytes(files[0]?.raw.size ?? 0)}`,
      });
    },
  });
  return (
    <ResponsiveModal
      asChild
      className="sm:max-w-xl"
      closeModal={setIsOpen}
      isOpen={isOpen}
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
      <div className="p-6 pt-0">
        <FormField
          control={form.control}
          name="attachmentUrl"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="flex items-center justify-between">
                Image
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
                <UploadDropzoneProgress
                  accept="image/*"
                  control={control}
                  description="Recommended: 1200 x 1200 pixels."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </ResponsiveModal>
  );
};
