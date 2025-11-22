import { FormControl, FormField, FormItem, FormLabel, FormMessage, useFormContext } from "@ziron/ui/components/form";
import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";
import { Switch } from "@ziron/ui/components/switch";
import { zCardSchema } from "@ziron/validators";

import { ThemeSelector } from "../fields/theme-selector";

interface Props {
  template: string;
}

export const CardCustomize = ({ template }: Props) => {
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
                <ThemeSelector onChange={field.onChange} value={field.value} />{" "}
              </ScrollArea>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <section className="divide-y">
        <h5 className="pb-3 font-medium text-sm">Customize Theme</h5>
        <FormField
          control={form.control}
          name={"appearance.isDarkMode"}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
              <FormLabel className="flex w-full items-center gap-1.5" htmlFor={field.name}>
                Dark Mode
                {/* <InfoTooltip
                  content={
                    <SimpleTooltipContent title="Display your logo in the center of the QR code." />
                  }
                /> */}
              </FormLabel>
              <FormControl>
                <div className="flex items-center justify-end">
                  <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center font-medium text-sm">
                    <Switch
                      checked={field.value}
                      className="peer [&_span]:data-[state=checked]:rtl:-translate-x-full absolute inset-0 h-[inherit] w-auto rounded-md data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-sm [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full"
                      id={field.name}
                      onCheckedChange={field.onChange}
                    />
                    <span className="peer-data-[state=unchecked]:rtl:-translate-x-full pointer-events-none relative ms-2 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=checked]:text-white">
                      <span className="font-medium text-[10px] uppercase">Off</span>
                    </span>
                    <span className="peer-data-[state=checked]:-translate-x-full pointer-events-none relative me-2 flex items-center justify-center pr-3.5 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-checked:translate-x-full peer-data-[state=checked]:text-white">
                      <span className="font-medium text-[10px] uppercase">On</span>
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
          name={"appearance.theme"}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
              <FormLabel>Theme Color</FormLabel>
              <FormControl>{/* <ColorsInput value={field.value} onChange={field.onChange} /> */}</FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {template === "modern" || template === "card" ? (
          <FormField
            control={form.control}
            name={"appearance.btnColor"}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
                <FormLabel>Button</FormLabel>
                <FormControl>{/* <ColorsInput value={field.value} onChange={field.onChange} /> */}</FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
      </section>
    </div>
  );
};
