import { FormControl, FormField, FormItem, FormLabel, FormMessage, useFormContext } from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import { Textarea } from "@ziron/ui/components/textarea";

import { EmailsType, PhonesType, zCardSchema } from "@ziron/validators";

import { EmailsField } from "../fields/emails-field";
import { OrganizationField } from "../fields/organization-field";
import { PhonesField } from "../fields/phone-field";

interface Props {
  data: {
    emails?: EmailsType;
    phones?: PhonesType;
    organizationId?: string;
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
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-fit"
                    placeholder="Enter Full Address"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mapUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Map Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://maps.app.goo.gl/link" {...field} value={field.value ?? ""} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <OrganizationField organizationId={data.organizationId} />
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Sales & Marketing" {...field} value={field.value ?? ""} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea placeholder="More about the person" {...field} value={field.value ?? ""} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
