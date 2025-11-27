import { IconPlus, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFieldArray,
  useFormContext,
} from "@ziron/ui/components/form";
import { InputGroup } from "@ziron/ui/components/input-group";
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
        <div className="flex w-full items-end" key={`phones-${field.id}-${i}`}>
          <FormField
            control={form.control}
            name={`phones.${i}.phone`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className={cn(i !== 0 && "sr-only")} htmlFor={field.name}>
                  Phone
                </FormLabel>
                <FormControl>
                  <ButtonGroup className="w-full">
                    <InputGroup>
                      <PhoneInput
                        className={cn("w-full rounded-e-none border-0 shadow-none")}
                        id={field.name}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </InputGroup>

                    <Select
                      defaultValue={form.getValues(`phones.${i}.label`)}
                      onValueChange={(e: (typeof LabelEnum.options)[number]) => form.setValue(`phones.${i}.label`, e)}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Label" />
                      </SelectTrigger>
                      <SelectContent>
                        {LabelEnum.options.map((option) => (
                          <SelectItem key={`phones-${i}-${option}`} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fields.length > 1 && (
                      <Button
                        className={cn("shrink-0 bg-transparent dark:bg-input/30 dark:hover:bg-input/50")}
                        onClick={() => remove(i)}
                        size="icon"
                        type="button"
                        variant="outline"
                      >
                        <IconX className="size-4 text-muted-foreground" />
                      </Button>
                    )}
                  </ButtonGroup>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
      <Button className="gap-1 px-0" onClick={handleAppend} size="sm" type="button" variant="link">
        <IconPlus className="size-4" />
        Add another number
      </Button>
    </div>
  );
};
