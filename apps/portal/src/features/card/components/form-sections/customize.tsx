import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "@ziron/ui/components/form";
import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";
import { zCardSchema } from "@ziron/validators";

import { ThemeSelector } from "../fields/theme-selector";

export const CardCustomize = () => {
  const form = useFormContext<zCardSchema>();
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="appearance.template"
        render={({ field }) => (
          <FormItem className="shrink-0 space-y-3 pb-6">
            <FormLabel>Choose a theme</FormLabel>
            <FormControl>
              <ScrollArea className="relative flex w-[calc(100svw-2rem)] gap-4 sm:w-auto md:gap-8">
                <ScrollBar orientation="horizontal" />
                <ThemeSelector
                  value={field.value}
                  onChange={field.onChange}
                />{" "}
              </ScrollArea>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
