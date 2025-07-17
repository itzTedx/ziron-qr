import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import { EmailsType, PhonesType, zCardSchema } from "@ziron/validators";

import { EmailsField } from "../fields/emails-field";
import { PhonesField } from "../fields/phone-field";

interface Props {
  data: {
    emails?: EmailsType;
    phones?: PhonesType;
  };
}

export const CardGeneral = ({ data }: Props) => {
  const form = useFormContext<zCardSchema>();

  return (
    <div className="space-y-6">
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
      <div className="grid gap-4 sm:grid-cols-2">
        <EmailsField data={data.emails} />
        <PhonesField data={data.phones} />

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
      </div>
    </div>
  );
};
