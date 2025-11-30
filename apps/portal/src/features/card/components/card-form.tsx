"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import { useFormState } from "react-hook-form";

import { Form, useForm, zodResolver } from "@ziron/ui/components/form";
import { TabsContent } from "@ziron/ui/components/tabs";

import { CardType } from "@ziron/db/schema";
import { cn } from "@ziron/utils";
import { cardSchema, zCardSchema } from "@ziron/validators";

import { UnsavedChangesBar } from "@/components/ui/unsaved-changes-bar";

import { transformCardData } from "../utils/transform-card-data";
import { CardCustomize } from "./form-sections/customize";
import { CardGeneral } from "./form-sections/general";
import { CardLinks } from "./form-sections/links";
import { hasAnyTouchedField } from "./helpers/has-touched-field";
import { useCreateCard } from "./helpers/use-create-card";
import { useUpdateCard } from "./helpers/use-update-card";
import { Preview } from "./preview";
import { ProfileDashboard } from "./profile-dashboard";
import { TabsLists } from "./tabs-lists";

interface Props {
  isEditMode?: boolean;
  initialData?: CardType;
}

export function CardForm({ isEditMode, initialData }: Props) {
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
  const createCard = useCreateCard(form);
  const updateCard = useUpdateCard(form);

  const data = {
    ...cardData,
    emails: cardData?.emails ?? undefined,
    template: cardData?.appearance?.template ?? "default",
    organizationId: cardData?.organizationId ?? "",
  };

  // Separate submit handlers
  function handleCreate(values: zCardSchema) {
    createCard.mutate(values);
  }

  function handleUpdate(values: zCardSchema) {
    if (initialData?.id) {
      updateCard.mutate({ id: initialData.id, ...values });
    }
  }

  function onSubmit(values: zCardSchema) {
    if (isEditMode && initialData?.id) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
        <div className={cn("mx-auto grid max-w-7xl grid-cols-1 gap-4 pb-6 lg:grid-cols-3", shouldShowBar && "pb-20")}>
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

          <Suspense fallback={<div>Loading Preview...</div>}>
            <Preview cardData={data} />
          </Suspense>
        </div>
      </form>
    </Form>
  );
}
