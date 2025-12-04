import { useEffect, useState } from "react";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { CheckCircle, Edit, Loader, X, XCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { ButtonGroup } from "@ziron/ui/components/button-group";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ziron/ui/components/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@ziron/ui/components/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ziron/ui/components/tooltip";
import { useKeyboardShortcut } from "@ziron/ui/hooks";

import { transformSlug, zCardSchema } from "@ziron/validators";

import { openShareModalAtom, ShareModalData } from "@/features/organization/atom";
import { useDebounce } from "@/hooks/debounce";
import { env } from "@/lib/env/client";
import { getPrettyUrl } from "@/lib/link/construct-url";
import { orpc } from "@/lib/orpc/client";

interface Props {
  data: Partial<Pick<zCardSchema, "id" | "name" | "designation" | "slug" | "image" | "cover">>;
  organizationId?: string;
}

type SlugValidationState = "idle" | "validating" | "valid" | "invalid";

export const SlugField = ({ data, organizationId }: Props) => {
  const form = useFormContext<zCardSchema>();
  const [slug, setSlug] = useState(data.slug ?? "");
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [validationState, setValidationState] = useState<SlugValidationState>("idle");
  const openModal = useSetAtom(openShareModalAtom);

  const { data: organization } = useSuspenseQuery(
    orpc.organization.get.queryOptions({ input: { id: organizationId } })
  );

  // Transform slug as user types
  const transformedSlug = transformSlug(slug);
  const debouncedSlug = useDebounce(transformedSlug, 500);

  const validateSlug = useMutation(
    orpc.card.checkSlug.mutationOptions({
      onSuccess: (response) => {
        if (!response.isAvailable) {
          setValidationState("invalid");
          toast.error("Slug is not available", { description: "Please enter a different slug" });
          return;
        }

        setValidationState("valid");
        const validatedSlug = response.slug ?? "";
        setSlug(validatedSlug);
        form.setValue("slug", validatedSlug, { shouldValidate: true });
        toast.success("Slug is available", { description: "You can now use this slug to access your card" });
      },
      onError: () => {
        setValidationState("invalid");
      },
    })
  );

  // Sync slug state when data.slug changes
  useEffect(() => {
    if (data.slug !== undefined && !isEditingSlug) {
      setSlug(data.slug);
    }
  }, [data.slug, isEditingSlug]);

  // Automatically validate when debounced slug changes
  useEffect(() => {
    if (!isEditingSlug) return;

    const slugToValidate = debouncedSlug.trim();

    // Skip validation if slug is empty or too short
    if (!slugToValidate || slugToValidate.length < 2) {
      setValidationState("idle");
      return;
    }

    // Skip validation if slug hasn't changed from the original
    if (slugToValidate === (data.slug ?? "")) {
      setValidationState("valid");
      form.setValue("slug", slugToValidate, { shouldValidate: true });
      return;
    }

    // Validate the slug
    setValidationState("validating");
    validateSlug.mutate({ slug: slugToValidate });
  }, [debouncedSlug, data.slug, form.setValue, isEditingSlug, validateSlug.mutate]);

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setSlug(newValue);
    setValidationState("idle");
  }

  function handleEditClick() {
    setIsEditingSlug(true);
    setValidationState("idle");
  }

  function saveSlug() {
    const slugToValidate = transformedSlug.trim();
    if (!slugToValidate || slugToValidate.length < 2) {
      toast.error("Please enter a slug (at least 2 characters)");
      return;
    }
    if (validationState === "valid") {
      setIsEditingSlug(false);
    }
  }

  function handleShare() {
    if (!data.id || !data.slug || !organization) {
      toast.error("Unable to share", { description: "Please ensure the card has been saved with a valid slug" });
      return;
    }

    const shareData: ShareModalData = {
      cardId: data.id,
    };

    openModal(shareData);
  }

  // Handle s keyboard shortcut
  useKeyboardShortcut("s", handleShare, { priority: 1 });

  return (
    <FormField
      control={form.control}
      name="designation"
      render={() => (
        <FormItem>
          <FormLabel>Link</FormLabel>
          <FormControl>
            <ButtonGroup className="w-full">
              <InputGroup className="h-10">
                <InputGroupAddon>
                  <InputGroupText>{getPrettyUrl(env.NEXT_PUBLIC_CLIENT_URL)}/</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  className="pl-0.5!"
                  disabled={!isEditingSlug}
                  onChange={handleSlugChange}
                  placeholder="untitled-card"
                  value={slug}
                />
                <InputGroupAddon align="inline-end">
                  {isEditingSlug ? (
                    <div className="flex items-center gap-1">
                      {validationState === "idle" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InputGroupButton
                              className="mr-[-0.45rem]"
                              onClick={() => setIsEditingSlug(false)}
                              size="icon-sm"
                            >
                              <X className="size-4" />
                            </InputGroupButton>
                          </TooltipTrigger>
                          <TooltipContent>Cancel</TooltipContent>
                        </Tooltip>
                      )}
                      {validationState === "validating" && <Loader className="size-4 animate-spin" />}
                      {validationState === "valid" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InputGroupButton className="mr-[-0.45rem]" onClick={saveSlug} size="icon-sm">
                              <CheckCircle className="size-4 text-green-500" />
                            </InputGroupButton>
                          </TooltipTrigger>
                          <TooltipContent>Slug is available</TooltipContent>
                        </Tooltip>
                      )}
                      {validationState === "invalid" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <XCircle className="size-4 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>Slug is not available</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton onClick={handleEditClick} size="icon-sm">
                          <Edit className="size-4 stroke-[1.5]" />
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent>Edit slug</TooltipContent>
                    </Tooltip>
                  )}
                </InputGroupAddon>
              </InputGroup>
            </ButtonGroup>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
