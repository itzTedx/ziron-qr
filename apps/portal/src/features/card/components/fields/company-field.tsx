import { useCallback, useMemo, useState } from "react";
import Image from "next/image";

import { IconCaretUpDownFilled } from "@tabler/icons-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useFormContext } from "react-hook-form";

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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ziron/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ziron/ui/components/popover";
import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

interface Props {
  data: Company[];
}

export const CompanyField = ({ data: data }: Props) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [, setCompanyModal] = useQueryStates({
    modal: parseAsString,
  });

  const form = useFormContext<zCardSchema>();

  const companyId = form.getValues("companyId");

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
    [form],
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

          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "border-input text-foreground dark:bg-input/30 w-full justify-between bg-transparent",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {selectedCompany ? (
                    <span className="inline-flex items-center gap-2.5">
                      <div className="relative aspect-square size-4">
                        <Image
                          src={
                            selectedCompany.logo ||
                            "/images/placeholder-cover.jpg"
                          }
                          fill
                          alt={`${selectedCompany.name} logo`}
                          className="object-contain"
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
            <PopoverContent align="start" className="p-0 sm:w-[19.5rem]">
              <Command>
                <CommandInput placeholder="Search Category..." />
                <CommandEmpty>Company not found</CommandEmpty>
                <CommandList className="max-h-[300px] overflow-auto">
                  <CommandGroup heading="Companies">
                    {data.map((cat) => (
                      <CommandItem
                        value={cat.name}
                        className="cursor-pointer gap-2.5 px-4 py-2.5 font-medium"
                        key={cat.id}
                        onSelect={() => handleSelect(cat.id?.toString())}
                      >
                        <Image
                          src={cat.logo || "/images/placeholder-cover.jpg"}
                          height={16}
                          width={16}
                          alt={`${cat.name} logo`}
                          loading="lazy"
                        />
                        <span>{cat.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup heading="New Company?">
                    <CommandItem
                      className="cursor-pointer px-4 py-2.5 font-medium"
                      onSelect={handleModalOpen}
                    >
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
