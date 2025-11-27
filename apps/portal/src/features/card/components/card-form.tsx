"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useFormState } from "react-hook-form";
import { toast } from "sonner";

import { Form, useForm, zodResolver } from "@ziron/ui/components/form";
import { Tabs, TabsContent } from "@ziron/ui/components/tabs";

import { CardType, Company } from "@ziron/db/schema";
import { cn } from "@ziron/utils";
import { cardSchema, zCardSchema } from "@ziron/validators";

import { UnsavedChangesBar } from "@/components/ui/unsaved-changes-bar";

import { orpc, queryClient } from "@/lib/orpc/client";

import { transformCardData } from "../utils/transform-card-data";
import { CardCustomize } from "./form-sections/customize";
import { CardGeneral } from "./form-sections/general";
import { CardLinks } from "./form-sections/links";
import { Preview } from "./preview";
import { ProfileDashboard } from "./profile-dashboard";
import { TabsLists } from "./tabs-lists";

interface Props {
  companies?: Company[];
  isEditMode: boolean;
  initialData?: CardType;
}

export function CardForm({ companies, isEditMode, initialData }: Props) {
  const router = useRouter();
  const [tab, setTab] = useQueryState("tab");
  const defaultTab = tab || "general";
  const [companyId, _] = useQueryState("companyId");
  const transformedInitialData = useMemo(() => transformCardData(initialData, companyId), [initialData, companyId]);
  const [cardData, setCardData] = useState<Partial<zCardSchema> | null>(transformedInitialData ?? null);
  const [hasBlurred, setHasBlurred] = useState(false);

  const form = useForm<zCardSchema>({
    resolver: zodResolver(cardSchema),
    defaultValues: transformedInitialData,
    mode: "onBlur",
  });

  // const validation = validateForm(form.watch(), cardSchema);

  // console.log(validation);
  // console.log("form data", form.getValues());

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

  const data = {
    ...cardData,
    companies,
    emails: cardData?.emails ?? undefined,

    template: cardData?.appearance?.template ?? "default",
    companyId: cardData?.companyId ?? companyId ?? "",
  };

  const createCard = useMutation(
    orpc.card.create.mutationOptions({
      onSuccess: (newCard) => {
        toast.success(`Card: ${newCard.cardName} has been ${isEditMode ? "Edited" : "Created"}`);
        form.reset(form.getValues(), { keepDefaultValues: true });
        queryClient.invalidateQueries({
          queryKey: orpc.card.list.queryKey(),
        });
        router.push("/");
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
        router.push("/");
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

  function onSubmit(values: zCardSchema) {
    if (isEditMode && initialData?.id) {
      updateCard.mutate({ id: initialData?.id, ...values });
    } else {
      createCard.mutate(values);
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

  // Helper function to check if any field is touched (including nested fields)
  function hasAnyTouchedField(touchedFields: Record<string, unknown>): boolean {
    for (const key in touchedFields) {
      if (touchedFields[key] === true) {
        return true;
      }
      if (typeof touchedFields[key] === "object" && touchedFields[key] !== null) {
        if (hasAnyTouchedField(touchedFields[key] as Record<string, unknown>)) {
          return true;
        }
      }
    }
    return false;
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

  const isPending = createCard.isPending || updateCard.isPending;
  // Show bar if form is dirty AND (at least one field has been touched OR any input has been blurred)
  const shouldShowBar = isDirty && (hasTouchedFields || hasBlurred);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ProfileDashboard
          company={
            companies?.find((c) => c.id === data.companyId)
              ? {
                  logo: companies.find((c) => c.id === data.companyId)?.logo ?? null,
                  name: companies.find((c) => c.id === data.companyId)?.name ?? "",
                }
              : undefined
          }
          companyName={companies?.find((c) => c.id === data.companyId)?.name}
          data={{
            id: data.id,
            name: data.name,
            designation: data.designation,
            slug: data.slug,
            image: data.image,
            cover: data.cover,
          }}
          isPending={isPending}
        />
        <div className={cn("mx-auto grid max-w-7xl grid-cols-3 gap-4 pb-6", shouldShowBar && "pb-20")}>
          <Tabs
            className="relative col-span-2 mt-6 w-full px-6"
            defaultValue={defaultTab}
            onValueChange={(value) => setTab(value)}
          >
            <TabsLists form={form} />
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
          </Tabs>
          <Preview cardData={data} companies={companies} />
        </div>
      </form>
    </Form>
  );
}
