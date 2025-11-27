import { startTransition, useMemo } from "react";

import { parseAsString, useQueryState } from "nuqs";
import { UseFormReturn } from "react-hook-form";

import { Tabs, TabsList, TabsTrigger } from "@ziron/ui/components/tabs";

import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

import { customizeFields, generalFields, hasFieldErrors, linksFields } from "../detect-errors";

interface Props {
  form: UseFormReturn<zCardSchema>;
  children: React.ReactNode;
}

export const TabsLists = ({ form, children }: Props) => {
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("general"));

  // Check for errors in each tab
  const errors = form.formState.errors;
  const hasGeneralErrors = useMemo(() => hasFieldErrors(errors, generalFields), [errors]);
  const hasLinksErrors = useMemo(() => hasFieldErrors(errors, linksFields), [errors]);
  const hasCustomizeErrors = useMemo(() => hasFieldErrors(errors, customizeFields), [errors]);

  function handleTabChange(value: string) {
    startTransition(() => {
      void setTab(value);
    });
  }

  return (
    <Tabs className="relative col-span-2 mt-6 w-full px-6" defaultValue={tab} onValueChange={handleTabChange}>
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
            {hasLinksErrors && <span aria-label="Errors in Links tab" className="size-2 rounded-full bg-destructive" />}
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
      {children}
    </Tabs>
  );
};
