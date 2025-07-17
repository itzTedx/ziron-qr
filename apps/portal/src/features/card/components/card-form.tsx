"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { validateForm } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { CardType, Company } from "@ziron/db/schema";
import { Form, useForm, zodResolver } from "@ziron/ui/components/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ziron/ui/components/tabs";
import { cardSchema, zCardSchema } from "@ziron/validators";

import { upsertCard } from "../actions/mutations";
import { CardCustomize } from "./form-sections/customize";
import { CardGeneral } from "./form-sections/general";
import { CardLinks } from "./form-sections/links";
import { ProfileDashboard } from "./profile-dashboard";

interface Props {
  companies: Company[];
  isEditMode: boolean;
  initialData?: CardType;
}

export function CardForm({ companies, isEditMode, initialData }: Props) {
  const router = useRouter();
  const [tab, setTab] = useQueryState("tab");
  const defaultTab = tab || "general";
  const [isPending, startTransition] = useTransition();
  const form = useForm<zCardSchema>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      id: initialData?.id ?? undefined,
      name: initialData?.name ?? "",
      emails: initialData?.emails.map((email) => ({
        id: email.id,
        email: email.email ?? undefined,
        label:
          email.label === "Primary" ||
          email.label === "Work" ||
          email.label === "Personal"
            ? email.label
            : "Primary",
      })),
      phones: [
        {
          phone: "",
          label: "Primary",
        },
      ],
      address: initialData?.address ?? "",
      mapUrl: initialData?.mapUrl ?? "",
      companyId: initialData?.companyId ?? "",
      designation: initialData?.designation ?? "",
      bio: initialData?.bio ?? "",
      appearance: {
        template: initialData?.styles?.template ?? "default",
        theme: initialData?.styles?.theme ?? "#4938ff",
        btnColor: initialData?.styles?.btnColor ?? "#4938ff",
        isDarkMode: initialData?.styles?.isDarkMode ?? false,
      },
    },
  });

  const formdata = form.watch();
  const validation = validateForm(formdata, cardSchema);

  console.log(validation);

  function onSubmit(values: zCardSchema) {
    startTransition(async () => {
      const result = await upsertCard(values);
      if (result.success) {
        toast.success(
          `Card: ${result.data?.name} has been ${isEditMode ? "Edited" : "Created"}`,
        );
        router.push("/");
      }
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  const generalInfoData = {
    companies,
    emails: form.getValues("emails"),
    phones: form.getValues("phones"),
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ProfileDashboard isPending={isPending} />
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4">
          <Tabs
            defaultValue={defaultTab}
            onValueChange={(value) => setTab(value)}
            className="col-span-2 mt-6 w-full px-6"
          >
            <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="general"
                className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="links"
                className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Links
              </TabsTrigger>
              <TabsTrigger
                value="customize"
                className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Customize
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <CardGeneral data={generalInfoData} />
            </TabsContent>
            <TabsContent value="links">
              <CardLinks />
            </TabsContent>
            <TabsContent value="customize">
              <CardCustomize />
            </TabsContent>
          </Tabs>
          {/* <Preview /> */}
        </div>
      </form>
    </Form>
  );
}
