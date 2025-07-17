import { useCallback } from "react";

import { PhoneInput } from "@/components/ui/phone-input";
import { IconPlus, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFieldArray,
  useFormContext,
} from "@ziron/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ziron/ui/components/select";
import { cn } from "@ziron/utils";
import { EmailsType, LabelEnum, zCardSchema } from "@ziron/validators";

interface Props {
  data: EmailsType;
}

export const PhonesField = ({ data }: Props) => {
  const form = useFormContext<zCardSchema>();

  const { fields, append, remove } = useFieldArray({
    name: "phones",
    control: form.control,
  });

  const handleAppend = useCallback(() => {
    if (data) {
      const lastEmailField = data[fields.length - 1];
      if (lastEmailField && !lastEmailField.email) {
        toast.error("Please add a email before adding another.");
        return;
      }
    }
    append({ phone: "", label: "Primary" });
  }, [data, fields.length, append]);
  return (
    <div className="space-y-2">
      {fields.map((field, i) => (
        <div className="flex w-full items-end" key={field.id}>
          <FormField
            control={form.control}
            name={`phones.${i}.phone`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className={cn(i !== 0 && "sr-only")}>
                  Phone
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    className={cn("w-full rounded-e-none border-r-0")}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`emails.${i}.label`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={"sr-only"}>Phone Label</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        "text-muted-foreground w-20 shrink-0 gap-0.5 rounded-none px-2 text-[11px] font-medium",
                        fields.length === 1
                          ? "rounded-e-lg border-r"
                          : "border-r-0",
                      )}
                    >
                      <SelectValue placeholder="Label" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LabelEnum.options.map((option) => (
                      <SelectItem value={option} key={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button
            size="icon"
            variant="outline"
            type="button"
            onClick={() => remove(i)}
            className={cn(
              "dark:bg-input/30 dark:hover:bg-input/50 shrink-0 bg-transparent",
              fields.length > 1 ? "flex rounded-s-none" : "hidden",
            )}
          >
            <IconX className="text-muted-foreground size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="link"
        size="sm"
        className="gap-1 px-0"
        onClick={handleAppend}
      >
        <IconPlus className="size-4" />
        Add work or personal email
      </Button>
    </div>
  );
};
