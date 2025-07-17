"use client";

import { useQueryState } from "nuqs";

import { Company } from "@ziron/db/schema";
import { Form, useForm, zodResolver } from "@ziron/ui/components/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ziron/ui/components/tabs";
import { cardSchema, zCardSchema } from "@ziron/validators";

import { CardGeneral } from "./form-sections/general";
import { ProfileDashboard } from "./profile-dashboard";

interface Props {
  companies: Company[];
  isEditMode: boolean;
}

export function CardForm({ companies, isEditMode }: Props) {
  const [tab, setTab] = useQueryState("tab");
  const defaultTab = tab || "general";
  const form = useForm<zCardSchema>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      id: "",
      name: "",
      bio: "",
      designation: "",
      companyId: "",
      emails: [
        {
          email: "",
          label: "Primary",
        },
      ],
      phones: [
        {
          phone: "",
          label: "Primary",
        },
      ],
    },
  });

  function onSubmit(values: zCardSchema) {
    console.log(values);
  }

  const generalInfoData = {
    companies,
    emails: form.getValues("emails"),
    phones: form.getValues("phones"),
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ProfileDashboard />
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
              <p className="text-muted-foreground p-4 text-center text-xs">
                Content for Tab 2
              </p>
            </TabsContent>
            <TabsContent value="customize">
              <p className="text-muted-foreground p-4 text-center text-xs">
                Content for Tab 3
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </Form>
  );
}
