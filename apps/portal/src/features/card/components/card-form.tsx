"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { useFormState } from "react-hook-form";
import { toast } from "sonner";

import { Form, useForm, zodResolver } from "@ziron/ui/components/form";
import { TabsContent } from "@ziron/ui/components/tabs";
import { useKeyboardShortcut } from "@ziron/ui/hooks";

import { CardType } from "@ziron/db/schema";
import { cn } from "@ziron/utils";
import { cardSchema, zCardSchema } from "@ziron/validators";

import { UnsavedChangesBar } from "@/components/ui/unsaved-changes-bar";

import { orpc, queryClient } from "@/lib/orpc/client";

import { transformCardData } from "../utils/transform-card-data";
import { SlugField } from "./fields/slug-field";
import { CardCustomize } from "./form-sections/customize";
import { CardGeneral } from "./form-sections/general";
import { CardLinks } from "./form-sections/links";
import { hasAnyTouchedField } from "./helpers/has-touched-field";
import { ProfileDashboard } from "./profile-dashboard";
import { TabsLists } from "./tabs-lists";

interface Props {
  isEditMode?: boolean;
  initialData?: CardType;
}

export function CardForm({ isEditMode, initialData }: Props) {
  const router = useRouter();

  // Conditionally get initial data based on mode
  const transformedInitialData = useMemo(() => {
    if (isEditMode && initialData) {
      return transformCardData(initialData);
    }
    // Create mode: return static defaults (no server fetch)
    return transformCardData();
  }, [isEditMode, initialData]);

  // In create mode, start with null (static, no initial data)
  // In edit mode, initialize with transformed data
  const [cardData, setCardData] = useState<Partial<zCardSchema> | null>(
    isEditMode && transformedInitialData ? transformedInitialData : null
  );
  const [hasBlurred, setHasBlurred] = useState(false);

  const form = useForm<zCardSchema>({
    resolver: zodResolver(cardSchema),
    defaultValues: transformedInitialData,
    mode: "onBlur",
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCardData(value as Partial<zCardSchema>);
      }, 1000);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [form.watch]);

  // Conditionally use mutations based on mode
  const createCard = useMutation(
    orpc.card.create.mutationOptions({
      onSuccess: (newCard) => {
        toast.success(`Card: ${newCard.cardName} has been Created`);
        form.reset(form.getValues(), { keepDefaultValues: true });
        queryClient.invalidateQueries({
          queryKey: orpc.card.list.queryKey(),
        });
        router.push("/cards");
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          if (error.code === "NOT_FOUND") {
            toast.error("Card not found", { description: error.message });
            return;
          }
          toast.error("Failed to create card, try again later!", { description: error.message });
          return;
        }
        toast.error(error.message);
      },
    })
  );
  const updateCard = useMutation(
    orpc.card.update.mutationOptions({
      onSuccess: (updatedCard) => {
        toast.success(`Card: ${updatedCard.cardName} has been updated`);
        form.reset(form.getValues(), { keepDefaultValues: true });
        queryClient.invalidateQueries({
          queryKey: orpc.card.list.queryKey(),
        });
        router.push("/cards");
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          if (error.code === "NOT_FOUND") {
            toast.error("Card not found", { description: error.message });
            return;
          }
          toast.error("Failed to update card, try again later!", { description: error.message });
          return;
        }
        toast.error(error.message);
      },
    })
  );

  const data = {
    ...cardData,
    emails: cardData?.emails ?? undefined,
    template: cardData?.appearance?.template ?? "default",
    organizationId: cardData?.organizationId ?? "",
  };

  // const validationResult = validateForm(form.watch(), cardSchema);
  // console.log(validationResult);

  // Separate submit handlers
  async function handleCreate(values: zCardSchema) {
    createCard.mutate(values);
  }

  async function handleUpdate(values: zCardSchema) {
    if (initialData?.id) {
      updateCard.mutate({ id: initialData.id, ...values });
    }
  }

  async function onSubmit(values: zCardSchema) {
    if (isEditMode && initialData?.id) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }

    form.reset();
  }

  function handleSave() {
    form.handleSubmit(onSubmit)();
  }

  function handleDiscard() {
    form.reset(transformedInitialData, { keepDefaultValues: true });
    setCardData(transformedInitialData ?? null);
    setHasBlurred(false);
  }

  // Subscribe to form state changes using useFormState for proper reactivity
  const { isDirty, touchedFields } = useFormState({ control: form.control });
  const hasTouchedFields = hasAnyTouchedField(touchedFields);

  // Track blur events on form inputs
  useEffect(() => {
    const handleBlur = () => {
      setHasBlurred(true);
    };

    const formElement = document.querySelector("form");
    if (formElement) {
      // Use capture phase to catch all blur events
      formElement.addEventListener("blur", handleBlur, true);
      return () => {
        formElement.removeEventListener("blur", handleBlur, true);
      };
    }
  }, []);

  const isPending = isEditMode ? updateCard.isPending : createCard.isPending;
  // Show bar if form is dirty AND (at least one field has been touched OR any input has been blurred)
  const shouldShowBar = isDirty && (hasTouchedFields || hasBlurred);

  // Go back to `/cards` when ESC is pressed
  useKeyboardShortcut("Escape", () => router.push("/cards"), {
    enabled: !isDirty,
  });

  // Save when CMD+S or CTRL+S is pressed
  useKeyboardShortcut(["meta+s", "ctrl+s"], handleSave, {
    enabled: isDirty,
    priority: 10,
    modal: true,
  });

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <ProfileDashboard
            data={{
              id: data.id,
              name: data.name,
              designation: data.designation,
              slug: data.slug,
              image: data.image,
              cover: data.cover,
            }}
            isPending={isPending}
            organization={data.organizationId ? { id: data.organizationId, name: data.name ?? "" } : undefined}
          />

          <div className={cn("mx-auto grid max-w-3xl grid-cols-1 gap-4 pb-6", shouldShowBar && "pb-20")}>
            <TabsLists form={form}>
              <TabsContent value="general">
                <CardGeneral data={data} />
              </TabsContent>
              <TabsContent value="links">
                <CardLinks
                  attachment={
                    data.attachmentUrl
                      ? { url: data.attachmentUrl, filename: data.attachmentFileName ?? undefined }
                      : null
                  }
                />
              </TabsContent>
              <TabsContent value="customize">
                <CardCustomize template={data.template} />
              </TabsContent>
              <UnsavedChangesBar
                isSaving={isPending}
                onDiscard={handleDiscard}
                onSave={handleSave}
                show={shouldShowBar}
              />
            </TabsLists>
          </div>
        </div>
        <div className="sticky top-0 px-4 md:h-[calc(100vh-calc(var(--spacing)*16)-16px)] md:px-6 lg:bg-sidebar lg:px-0">
          <div className="mx-auto max-w-xl lg:divide-y">
            <div className="py-4 lg:px-4 lg:py-6">
              <SlugField data={data} organizationId={data.organizationId} />
            </div>
          </div>
        </div>
        {/* <Suspense fallback={<div>Loading Preview...</div>}>
          <Preview cardData={data} />
        </Suspense> */}
      </form>
    </Form>
  );
}
