import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import { Checkbox } from "@ziron/ui/components/checkbox";
import { DateRangePicker } from "@ziron/ui/components/data-picker";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@ziron/ui/components/field";
import { zodResolver } from "@ziron/ui/components/form";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";

import { columns, ExportCardType, exportCardColumnsDefault, exportCardSchema } from "@ziron/validators";

import { Tooltip } from "@/components/shared/tooltip";
import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";
import { Switch } from "@/components/ui/switch";

import { IconCircleQuestion } from "@/assets/icons/question";

import { INTERVAL_DISPLAYS } from "@/lib/constants";
import { getIntervalData } from "@/lib/get-interval-data";
import { orpc } from "@/lib/orpc/client";

export const ExportCardModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const form = useForm<ExportCardType>({
    resolver: zodResolver(exportCardSchema),
    defaultValues: {
      dateRange: { interval: "all" },
      columns: exportCardColumnsDefault,
      useFilters: true,
    },
  });

  const { isPending, mutate } = useMutation(
    orpc.card.exportAll.mutationOptions({
      onMutate: () => {
        const lid = toast.loading("Exporting cards...");
        return { lid };
      },
      onSuccess: async (data, _variables, context) => {
        toast.dismiss(context?.lid);

        // Create blob from CSV string
        const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        // Format filename with date
        const date = new Date();
        const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD format
        a.download = `Cards Export - ${dateStr}.csv`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success("Exported successfully");
        setOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to export cards", { description: error.message });
      },
    })
  );

  function onSubmit(values: ExportCardType) {
    // Convert interval to dates if interval is set but dates are not
    let dateRange = values.dateRange;

    if (dateRange.interval && (!dateRange.from || !dateRange.to)) {
      const intervalData = getIntervalData(dateRange.interval);
      if (intervalData) {
        dateRange = {
          from: intervalData.startDate,
          to: new Date(),
          interval: dateRange.interval,
        };
      }
    }

    // Ensure dates are Date objects
    const submitValues: ExportCardType = {
      ...values,
      dateRange: {
        from: dateRange.from instanceof Date ? dateRange.from : undefined,
        to: dateRange.to instanceof Date ? dateRange.to : undefined,
        interval: dateRange.interval,
      },
    };

    mutate(submitValues);
  }

  return (
    <ResponsiveModal onOpenChange={setOpen} open={open}>
      <ResponsiveModalContent className="md:max-w-md" title="Export Cards">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-0">
            <div className="space-y-6 p-6">
              <Controller
                control={form.control}
                name="dateRange"
                render={({ field, fieldState }) => (
                  <FieldSet>
                    <FieldLegend className="mb-1" data-invalid={fieldState.invalid} variant="label">
                      Date Range
                    </FieldLegend>
                    <DateRangePicker
                      className="w-full"
                      id={field.name}
                      onChange={(dateRange, preset) => {
                        // If preset is selected, store both the interval and the dates
                        // This allows us to use dates for API call and interval for display
                        if (preset) {
                          field.onChange({
                            interval: preset.id,
                            from: dateRange?.from,
                            to: dateRange?.to,
                          });
                        } else if (dateRange) {
                          // Custom date range selected - clear interval
                          field.onChange({
                            from: dateRange.from,
                            to: dateRange.to,
                            interval: undefined,
                          });
                        }
                      }}
                      presetId={!field.value?.from || !field.value.to ? (field.value?.interval ?? "all") : undefined}
                      presets={INTERVAL_DISPLAYS.map(({ display, value }) => ({
                        id: value,
                        label: display,
                        dateRange: {
                          from: getIntervalData(value)?.startDate,
                          to: new Date(),
                        },
                      }))}
                      value={
                        field.value?.from && field.value?.to
                          ? {
                              from: field.value.from,
                              to: field.value.to,
                            }
                          : undefined
                      }
                    />
                  </FieldSet>
                )}
              />
              <Controller
                control={form.control}
                name="columns"
                render={({ field, fieldState }) => (
                  <FieldSet>
                    <FieldLegend className="block" variant="label">
                      Columns
                    </FieldLegend>
                    <FieldGroup className="grid grid-cols-2" data-slot="checkbox-group">
                      {columns.map((addon) => (
                        <Field data-invalid={fieldState.invalid} key={addon.id} orientation="horizontal">
                          <Checkbox
                            aria-invalid={fieldState.invalid}
                            checked={field.value?.includes(addon.id)}
                            id={`form-rhf-complex-${addon.id}`}
                            name={field.name}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(field.value ?? []), addon.id]
                                : (field.value?.filter((value) => value !== addon.id) ?? []);
                              field.onChange(newValue);
                              field.onBlur();
                            }}
                          />
                          <FieldContent>
                            <FieldLabel htmlFor={`form-rhf-complex-${addon.id}`}>{addon.label}</FieldLabel>
                          </FieldContent>
                        </Field>
                      ))}
                    </FieldGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldSet>
                )}
              />
            </div>
            <FieldSeparator />
            <Controller
              control={form.control}
              name="useFilters"
              render={({ field, fieldState }) => (
                <Field className="px-6 py-4" data-invalid={fieldState.invalid} orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-complex-useFilters">
                      Apply Current Filter{" "}
                      <Tooltip content="Filter exported links by your currently selected filters">
                        <IconCircleQuestion className="size-3.5 text-muted-foreground" />
                      </Tooltip>
                    </FieldLabel>
                  </FieldContent>
                  <Switch
                    aria-invalid={fieldState.invalid}
                    checked={field.value}
                    id="form-rhf-complex-useFilters"
                    name={field.name}
                    onCheckedChange={field.onChange}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <ResponsiveModalFooter>
            <ResponsiveModalClose asChild>
              <Button className="bg-card" type="button" variant="outline">
                Cancel
              </Button>
            </ResponsiveModalClose>

            <Button disabled={isPending} type="submit" variant="inverted">
              <LoadingSwap isLoading={isPending}>Export Cards</LoadingSwap>
            </Button>
          </ResponsiveModalFooter>
        </form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
