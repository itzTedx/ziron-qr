import { useCallback, useMemo, useState } from "react";

import Image from "next/image";

import { IconCaretUpDownFilled } from "@tabler/icons-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Company } from "@ziron/db/schema";
import { Button } from "@ziron/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ziron/ui/components/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, useFormContext } from "@ziron/ui/components/form";
import { Popover, PopoverContent, PopoverTrigger } from "@ziron/ui/components/popover";
import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

interface Props {
  data: Company[];
  companyId?: string;
}

export const CompanyField = ({ data: data, companyId }: Props) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [, setCompanyModal] = useQueryStates({
    modal: parseAsString,
  });

  const form = useFormContext<zCardSchema>();

  // Memoize company lookup
  const selectedCompany = useMemo(() => {
    return data.find((cat) => cat.id === companyId);
  }, [data, companyId]);

  // Memoize selection handler
  const handleSelect = useCallback(
    (companyId?: string) => {
      if (companyId) {
        form.setValue("companyId", companyId);
        setOpenPopover(false);
      }
    },
    [form]
  );

  // Memoize modal handler
  const handleModalOpen = useCallback(() => {
    setOpenPopover(false);
    setCompanyModal({ modal: "company" });
  }, []);

  return (
    <FormField
      control={form.control}
      name="companyId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Company</FormLabel>

          <Popover onOpenChange={setOpenPopover} open={openPopover}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  className={cn(
                    "w-full justify-between border-input bg-transparent text-foreground dark:bg-input/30",
                    !field.value && "text-muted-foreground"
                  )}
                  role="combobox"
                  variant="outline"
                >
                  {selectedCompany ? (
                    <span className="inline-flex items-center gap-2.5">
                      <div className="relative aspect-square size-4">
                        <Image
                          alt={`${selectedCompany.name} logo`}
                          className="object-contain"
                          fill
                          src={selectedCompany.logo || "/images/placeholder-cover.jpg"}
                        />
                      </div>
                      <span>{selectedCompany.name}</span>
                    </span>
                  ) : (
                    "Select Category"
                  )}
                  <IconCaretUpDownFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0 sm:w-78">
              <Command>
                <CommandInput placeholder="Search Category..." />
                <CommandEmpty>Company not found</CommandEmpty>
                <CommandList className="max-h-[300px] overflow-auto">
                  <CommandGroup heading="Companies">
                    {data.map((cat) => (
                      <CommandItem
                        className="cursor-pointer gap-2.5 px-4 py-2.5 font-medium"
                        key={cat.id}
                        onSelect={() => handleSelect(cat.id?.toString())}
                        value={cat.name}
                      >
                        <Image
                          alt={`${cat.name} logo`}
                          height={16}
                          loading="lazy"
                          src={cat.logo || "/images/placeholder-cover.jpg"}
                          width={16}
                        />
                        <span>{cat.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup heading="New Company?">
                    <CommandItem className="cursor-pointer px-4 py-2.5 font-medium" onSelect={handleModalOpen}>
                      Add new
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
