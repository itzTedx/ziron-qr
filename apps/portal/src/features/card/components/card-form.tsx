"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/hooks/debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { CardType, Company } from "@ziron/db/schema";
import { Button } from "@ziron/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import { Label } from "@ziron/ui/components/label";
import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";
import { TabsContent } from "@ziron/ui/components/tabs";
import { Textarea } from "@ziron/ui/components/textarea";
import { cn } from "@ziron/utils";
import { cardSchema, zCardSchema } from "@ziron/validators";

import { DndLinks } from "./dnd-links";
import { CompanyField } from "./fields/company-field";
import { EmailsField } from "./fields/emails-field";
import { PhonesField } from "./fields/phones-field";
import { ThemeSelector } from "./fields/theme-selector";
import { Preview } from "./preview";
import ProfileDashboard from "./profile-dashboard";
import { TabsComp } from "./tabs";

interface CardProps {
  data: Company[];
  isEditMode: boolean;
  initialData?: CardType;
  id: string;
}

const MemoizedPreview = memo(Preview);

export default function CardForm({
  data,
  isEditMode,
  initialData,
  id,
}: CardProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  //   const { onOpenChange, isOpen } = usePreviewModalStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  // Optimize form initialization
  //   const defaultValues = useMemo(
  //     () => transformInitialData(initialData, id),
  //     [initialData, id],
  //   );

  const form = useForm<zCardSchema>({
    resolver: zodResolver(cardSchema),

    // defaultValues,
    mode: "onChange",
  });

  // Optimize form watching
  const formValues = useWatch({
    control: form.control,
  });
  const debouncedValue = useDebounce(formValues, 100);

  // Memoize company ID effect
  useEffect(() => {
    const companyIdParams = searchParams.get("company");
    if (companyIdParams) {
      form.setValue("companyId", parseInt(companyIdParams));
    }
  }, [searchParams, form]);

  // Optimize action handler
  //   const { execute } = useAction(createCard, {
  //     onExecute: useCallback(() => {
  //       toast.loading("Loading");
  //       setLoading(true);
  //     }, []),
  //     onSuccess: ({ data }) => {
  //       if (data?.success) {
  //         router.push(`/?default=${data?.company}`);
  //         toast.dismiss();
  //         toast.success(data.success);
  //         setLoading(false);
  //       }
  //     },

  //     onError: useCallback(() => {
  //       toast.error("Something went wrong.");
  //       setLoading(false);
  //     }, []),
  //   });

  // Memoize card data transformation
  const cardData = useMemo(() => {
    const companyId = debouncedValue.companyId;
    const companyData = data?.find((c) => c.id === companyId);
    const placeholderPhoto = debouncedValue.name
      ? `https://ui-avatars.com/api/?background=random&name=${debouncedValue.name}&size=128`
      : null;

    return {
      ...debouncedValue,
      name: debouncedValue.name || "",
      image: debouncedValue.image || placeholderPhoto,
      company: companyData,
      links: debouncedValue.links?.map((link) => ({
        ...link,
        id: link.id ? parseInt(link.id.toString()) : undefined,
      })),
    } as CardType;
  }, [data, debouncedValue]);

  /** Debugging */
  // const validation = cardSchema.safeParse(debouncedValue);
  // console.log("Validations: ", validation);

  // Optimize submit handler
  function onSubmit(values: zCardSchema) {
    const validation = cardSchema.safeParse(values);
    if (!validation.success) {
      toast.error("Please fill valid details");
      return;
    }
    console.log(values);
  }

  return (
    <main className="relative pb-9 sm:pb-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(isEditMode && "mt-4", "relative")}
        >
          {isEditMode && initialData && (
            <ProfileDashboard data={cardData} loading={loading} />
          )}

          <div
            className={cn(
              "container grid max-w-7xl gap-8 py-3 pb-9 md:grid-cols-12 md:py-9",
              !isEditMode && "mt-14",
            )}
          >
            <TabsComp>
              <TabsContent
                value="information"
                className="grid grid-cols-2 gap-4"
              >
                <ImageUploadButton
                  isEditMode={isEditMode}
                  cardData={cardData}
                  setLoading={setLoading}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <EmailsField emails={cardData.emails} />
                <PhonesField phones={cardData.phones} />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Address"
                          {...field}
                          className="[field-sizing:content] min-h-[2rem]"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mapUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Google Map URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CompanyField
                  companyData={data}
                  companyId={cardData.companyId}
                />

                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sales & Marketing"
                          {...field}
                          type="text"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="More about the person"
                          className="[field-sizing:content]"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* {!isEditMode && (
                  <CoverUpload
                    cover={cardData.cover || undefined}
                    setLoading={setLoading}
                  />
                )} */}
              </TabsContent>
              <TabsContent value="links" className="flex flex-col gap-8">
                <DndLinks loading={loading} open={open} setOpen={setOpen} />

                {/* <AttachmentUpload
                  setLoading={setLoading}
                  filename={cardData.attachmentFileName || undefined}
                  url={cardData.attachmentUrl || undefined}
                /> */}
              </TabsContent>
              <TabsContent
                value="template"
                className="flex flex-col gap-4 overflow-hidden"
              >
                <Label className="text-foreground text-sm leading-none font-medium">
                  Choose a theme
                </Label>
                <ScrollArea className="relative flex w-[calc(100svw-2rem)] gap-4 overflow-x-clip px-3 sm:w-auto md:gap-8">
                  <ScrollBar orientation="horizontal" />

                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem className="shrink-0 space-y-3 pb-6">
                        <FormControl>
                          <ThemeSelector
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </ScrollArea>
                <section className="divide-y">
                  <h5 className="pb-3 text-sm font-medium">Customize Theme</h5>
                  <FormField
                    control={form.control}
                    name={"isDarkMode"}
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
                        <FormLabel className="flex items-center gap-1.5">
                          Dark Mode
                          <InfoTooltip
                            content={
                              <SimpleTooltipContent title="Display your logo in the center of the QR code." />
                            }
                          />
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-between">
                            <div className="relative inline-grid h-8 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                              <Switch
                                id="logo"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto rounded-lg [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
                              />
                              <span className="pointer-events-none relative ms-0.5 flex min-w-78 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
                                <span className="text-[10px] font-medium uppercase">
                                  Off
                                </span>
                              </span>
                              <span className="pointer-events-none relative me-0.5 flex min-w-78 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-white peer-data-[state=unchecked]:invisible rtl:peer-data-[state=checked]:translate-x-full">
                                <span className="text-[10px] font-medium uppercase">
                                  On
                                </span>
                              </span>
                            </div>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"theme"}
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
                        <FormLabel>Theme Color</FormLabel>
                        <FormControl>
                          <ColorsInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {cardData.template === "modern" ||
                  cardData.template === "card" ? (
                    <FormField
                      control={form.control}
                      name={"btnColor"}
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
                          <FormLabel>Button</FormLabel>
                          <FormControl>
                            <ColorsInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}
                </section>
              </TabsContent>
              {!isEditMode && (
                <Button
                  type="submit"
                  className="mt-4 hidden h-12 w-full md:flex"
                  disabled={form.formState.isSubmitting || loading}
                >
                  Create Card
                </Button>
              )}
            </TabsComp>

            <MemoizedPreview
              closeModal={onOpenChange}
              isOpen={isOpen}
              cardData={cardData}
              company={data}
            />
          </div>
          <ActionButtons
            isEditMode={isEditMode}
            disabled={form.formState.isSubmitting || loading}
          />
        </form>
      </Form>
    </main>
  );
}
