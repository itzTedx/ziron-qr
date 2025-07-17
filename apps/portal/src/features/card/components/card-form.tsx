"use client";

import { useQueryState } from "nuqs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ziron/ui/components/tabs";
import { cardSchema, zCardSchema } from "@ziron/validators";

import { ProfileDashboard } from "./profile-dashboard";

export function CardForm() {
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
    },
  });

  function onSubmit(values: zCardSchema) {
    console.log(values);
  }

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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
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
