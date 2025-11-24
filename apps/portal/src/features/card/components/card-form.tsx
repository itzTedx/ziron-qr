"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { CardType, Company } from "@ziron/db/schema";
import { Form, useForm, zodResolver } from "@ziron/ui/components/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ziron/ui/components/tabs";
import { cn } from "@ziron/utils";
import { cardSchema, zCardSchema } from "@ziron/validators";

import { orpc, queryClient } from "@/lib/orpc/client";

import { customizeFields, generalFields, hasFieldErrors, linksFields } from "../detect-errors";
import { transformCardData } from "../utils/transform-card-data";
import { CardCustomize } from "./form-sections/customize";
import { CardGeneral } from "./form-sections/general";
import { CardLinks } from "./form-sections/links";
import { Preview } from "./preview";
import { ProfileDashboard } from "./profile-dashboard";

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

  // Check for errors in each tab
  const errors = form.formState.errors;
  const hasGeneralErrors = useMemo(() => hasFieldErrors(errors, generalFields), [errors]);
  const hasLinksErrors = useMemo(() => hasFieldErrors(errors, linksFields), [errors]);
  const hasCustomizeErrors = useMemo(() => hasFieldErrors(errors, customizeFields), [errors]);

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
          isPending={createCard.isPending}
        />
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 pb-6">
          <Tabs
            className="col-span-2 mt-6 w-full px-6"
            defaultValue={defaultTab}
            onValueChange={(value) => setTab(value)}
          >
            <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                className={cn(
                  "relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary",
                  hasGeneralErrors && "text-destructive data-[state=active]:text-destructive"
                )}
                value="general"
              >
                <span className="inline-flex items-center gap-1.5">
                  General
                  {hasGeneralErrors && (
                    <span aria-label="Errors in General tab" className="size-2 rounded-full bg-destructive" />
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger
                className={cn(
                  "relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary",
                  hasLinksErrors && "text-destructive"
                )}
                value="links"
              >
                <span className="inline-flex items-center gap-1.5">
                  Links
                  {hasLinksErrors && (
                    <span aria-label="Errors in Links tab" className="size-2 rounded-full bg-destructive" />
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger
                className={cn(
                  "relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary",
                  hasCustomizeErrors && "text-destructive"
                )}
                value="customize"
              >
                <span className="inline-flex items-center gap-1.5">
                  Customize
                  {hasCustomizeErrors && (
                    <span aria-label="Errors in Customize tab" className="size-2 rounded-full bg-destructive" />
                  )}
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <CardGeneral data={data} />
            </TabsContent>
            <TabsContent value="links">
              <CardLinks />
            </TabsContent>
            <TabsContent value="customize">
              <CardCustomize template={data.template} />
            </TabsContent>
          </Tabs>
          <Preview cardData={data} companies={companies} />
        </div>
      </form>
    </Form>
  );
}
