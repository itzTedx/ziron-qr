"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useUploadFiles } from "@better-upload/client";
import { formatBytes } from "@better-upload/client/helpers";
import { IconCamera, IconInfoCircle, IconLink, IconX } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import {
  Cropper,
  CropperArea,
  CropperAreaData,
  CropperImage,
  CropperPoint,
  CropperProps,
} from "@ziron/ui/components/cropper";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ziron/ui/components/form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ziron/ui/components/hover-card";
import { Label } from "@ziron/ui/components/label";
import { Slider } from "@ziron/ui/components/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";

import { zCardSchema } from "@ziron/validators";

import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";

import { UPLOAD_ROUTES } from "@/lib/constants/upload";

export const PhotoUploadModal = ({ currentImage }: { currentImage?: string }) => {
  const form = useFormContext<zCardSchema>();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<CropperPoint>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<CropperAreaData | null>(null);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onCropAreaChange: NonNullable<CropperProps["onCropAreaChange"]> = useCallback((_, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const onCropComplete: NonNullable<CropperProps["onCropComplete"]> = useCallback((_, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const onCropReset = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
  }, []);

  const resetAll = useCallback(() => {
    setSelectedFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
  }, []);

  const { control, upload } = useUploadFiles({
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
      resetAll();
      setIsOpen(false);
    },
  });
  const { isPending } = control;

  const handleModalOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        resetAll();
      }
    },
    [resetAll]
  );

  // Initialize with existing image when modal opens
  useEffect(() => {
    if (isOpen && currentImage && !selectedFile) {
      // Reset crop state when opening with existing image
      onCropReset();
    }
  }, [isOpen, currentImage, selectedFile, onCropReset]);

  return (
    <ResponsiveModal onOpenChange={handleModalOpenChange} open={isOpen}>
      <ResponsiveModalTrigger asChild>
        <Button
          className="absolute right-1 bottom-1 z-10 flex items-center justify-center rounded-full"
          size="icon-sm"
          variant="secondary"
        >
          <IconCamera className="size-4" />
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="sm:max-w-xl">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Update Profile Picture</ResponsiveModalTitle>
        </ResponsiveModalHeader>
        <div className="p-6 pt-0">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => {
              // Use previewUrl if a new file is selected, otherwise use the existing image from form
              const activeImage = previewUrl ?? currentImage ?? null;

              const handleUploadOverride = (files: File[] | FileList, _options?: unknown) => {
                const incomingFiles = Array.isArray(files) ? files : Array.from(files);
                const [file] = incomingFiles;
                if (!file) return;
                setSelectedFile(file);
                onCropReset();
                field.onChange(null);
              };

              const handleCropApply = async () => {
                if (!croppedArea || !activeImage) return;
                try {
                  const croppedFile = await createCroppedImage(
                    activeImage,
                    croppedArea,
                    selectedFile?.name ?? "profile-image.png"
                  );
                  upload([croppedFile]);
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Failed to crop image");
                }
              };

              return (
                <FormItem>
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
                    {activeImage ? (
                      <div className="relative flex flex-col gap-2">
                        {selectedFile && (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button className="absolute top-2 left-2 z-10" size="icon-sm" variant="ghost">
                                <IconInfoCircle />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <p>{selectedFile.name}</p>
                              <p>{formatBytes(selectedFile.size)}</p>
                              <p>{selectedFile.type}</p>
                            </HoverCardContent>
                          </HoverCard>
                        )}
                        <Tooltip>
                          <Button
                            className="absolute top-2 right-2 z-10"
                            onClick={() => {
                              form.setValue("image", undefined);
                              setSelectedFile(null);
                              resetAll();
                            }}
                            size="icon-sm"
                            variant="destructive"
                          >
                            <IconX />
                          </Button>
                        </Tooltip>
                        <Cropper
                          aspectRatio={1}
                          className="h-80"
                          crop={crop}
                          key={activeImage}
                          onCropAreaChange={onCropAreaChange}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                          shape="circle"
                          zoom={zoom}
                        >
                          <CropperImage alt="cropped image" crossOrigin="anonymous" src={activeImage} />
                          <CropperArea />
                        </Cropper>
                        <div className="flex items-center gap-2">
                          <div className="flex grow flex-col gap-2">
                            <Label className="text-sm">Zoom: {zoom.toFixed(2)}</Label>
                            <Slider
                              className="w-full"
                              max={3}
                              min={1}
                              onValueChange={(value) => setZoom(value[0] ?? 1)}
                              step={0.1}
                              value={[zoom]}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button disabled={isPending} onClick={onCropReset} variant="outline">
                              Reset
                            </Button>
                            <Button disabled={!croppedArea || isPending} onClick={handleCropApply}>
                              Save Image
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <UploadDropzoneProgress
                        accept="image/*"
                        control={control}
                        description="Recommended: 1200 x 1200 pixels."
                        uploadOverride={handleUploadOverride}
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
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export async function createCroppedImage(imageSrc: string, cropData: CropperAreaData, fileName: string): Promise<File> {
  const image = new Image();
  image.crossOrigin = "anonymous";

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = cropData.width;
      canvas.height = cropData.height;

      ctx.drawImage(
        image,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
        0,
        0,
        cropData.width,
        cropData.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        const croppedFile = new File([blob], `cropped-${fileName}`, {
          type: "image/png",
        });
        resolve(croppedFile);
      }, "image/png");
    };

    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = imageSrc;
  });
}
