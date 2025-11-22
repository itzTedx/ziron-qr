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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ziron/ui/components/select";
import { cn } from "@ziron/utils";
import { LabelEnum, PhonesType, zCardSchema } from "@ziron/validators";

import { PhoneInput } from "@/components/ui/phone-input";

interface Props {
  data: PhonesType;
}

export const PhonesField = ({ data }: Props) => {
  const form = useFormContext<zCardSchema>();

  const { fields, append, remove } = useFieldArray({
    name: "phones",
    control: form.control,
  });

  const handleAppend = () => {
    if (data) {
      const lastPhoneField = data[fields.length - 1];
      if (lastPhoneField && !lastPhoneField.phone) {
        toast.error("Please add a phone number before adding another.");
        return;
      }
    }
    append({ phone: "", label: "Primary" });
  };
  return (
    <div className="space-y-2">
      {fields.map((field, i) => (
        <div className="flex w-full items-end" key={field.id}>
          <FormField
            control={form.control}
            name={`phones.${i}.phone`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className={cn(i !== 0 && "sr-only")}>Phone</FormLabel>
                <FormControl>
                  <PhoneInput
                    className={cn("w-full rounded-e-none border-r-0")}
                    onChange={field.onChange}
                    value={field.value}
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

                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        "w-20 shrink-0 gap-0.5 rounded-none px-2 font-medium text-[11px] text-muted-foreground",
                        fields.length === 1 ? "rounded-e-lg border-r" : "border-r-0"
                      )}
                    >
                      <SelectValue placeholder="Label" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LabelEnum.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button
            className={cn(
              "shrink-0 bg-transparent dark:bg-input/30 dark:hover:bg-input/50",
              fields.length > 1 ? "flex rounded-s-none" : "hidden"
            )}
            onClick={() => remove(i)}
            size="icon"
            type="button"
            variant="outline"
          >
            <IconX className="size-4 text-muted-foreground" />
          </Button>
        </div>
      ))}
      <Button className="gap-1 px-0" onClick={handleAppend} size="sm" type="button" variant="link">
        <IconPlus className="size-4" />
        Add another number
      </Button>
    </div>
  );
};
