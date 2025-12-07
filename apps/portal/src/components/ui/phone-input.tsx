"use client";

import React, { useId } from "react";

import { ChevronDownIcon, PhoneIcon } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { List } from "react-window";

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ziron/ui/components/command";
import { Input } from "@ziron/ui/components/input";
import { InputGroupInput } from "@ziron/ui/components/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@ziron/ui/components/popover";

import { cn } from "@ziron/utils";

import { COUNTRY_DATA } from "@/lib/countries";

export type PhoneInputProps = {
  value?: string;
  onChange: (value: string) => void;

  className?: string;
  id?: string;
  placeholder?: string;
  countrySelectProps?: Partial<CountrySelectProps>;
  disabled?: boolean;
};

export function PhoneInput({
  value,
  onChange,
  className = "",
  id,
  placeholder = "Enter phone number",
  countrySelectProps = {},
  disabled = false,
}: PhoneInputProps) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <RPNInput.default
      className={cn("flex border-0 bg-transparent", className)}
      countrySelectComponent={(props) => <CountrySelect {...props} {...countrySelectProps} />}
      disabled={disabled}
      flagComponent={FlagComponent}
      id={inputId}
      inputComponent={PlainInput as unknown as React.ComponentProps<typeof RPNInput.default>["inputComponent"]}
      international
      onChange={(v) => {
        onChange(v ?? "");
      }}
      placeholder={placeholder}
      value={value}
    />
  );
}
PhoneInput.displayName = "PhoneInput";

const PlainInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, type, ...props }, ref) => {
    return <InputGroupInput className={cn("-ms-px w-full", className)} data-slot="phone-input" ref={ref} {...props} />;
  }
);
PlainInput.displayName = "PlainInput";

/** Virtualized list (renders only visible rows) */
const CountryList = ({
  items,
  onSelect,
  search,
}: {
  items: typeof COUNTRY_DATA;
  onSelect: (code: string) => void;
  search: string;
}) => {
  // Filter items based on search
  const filteredItems = React.useMemo(() => {
    if (!search) return items;
    const searchLower = search.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.callingCode.includes(search) ||
        item.code.toLowerCase().includes(searchLower)
    );
  }, [items, search]);

  return (
    <List
      rowComponent={({ index, style, ariaAttributes }) => {
        const item = filteredItems[index];
        if (!item) {
          return <div {...ariaAttributes} style={style} />;
        }
        return (
          <CommandItem
            className="flex items-center gap-2 px-3 py-2"
            key={`country-list-${item.code}-${item.name}-${index}-${item.callingCode}`}
            onSelect={() => {
              onSelect(item.code);
            }}
            style={style}
            value={item.name}
            {...ariaAttributes}
          >
            <FlagComponent aria-hidden="true" country={item.code} countryName={item.name} />
            <span className="text-sm">{item.name}</span>
            <span className="ml-auto text-muted-foreground text-xs">+{item.callingCode}</span>
          </CommandItem>
        );
      }}
      rowCount={filteredItems.length}
      rowHeight={44}
      rowProps={{}}
      style={{ height: 300, width: "100%" }}
    />
  );
};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
};

const CountrySelect = ({ disabled, value, onChange }: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const deferredSearch = React.useDeferredValue(search);
  const selected = value;

  // Reset search when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative inline-flex items-center self-stretch rounded-s-md border border-input-border bg-input py-2 ps-3 pe-2 text-muted-foreground outline-none transition-[color,box-shadow] focus-within:z-10 focus-within:ring-[3px] hover:bg-accent hover:text-foreground hover:brightness-120 has-disabled:pointer-events-none has-disabled:opacity-50",
            disabled && "pointer-events-none opacity-50"
          )}
          disabled={disabled}
          type="button"
        >
          <span className="inline-flex items-center gap-1">
            <FlagComponent aria-hidden="true" country={selected} countryName={selected} />

            <ChevronDownIcon aria-hidden="true" className="size-3" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0">
        <Command shouldFilter={false}>
          <CommandInput onValueChange={setSearch} placeholder="Search country..." value={search} />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandList className="max-h-60 overflow-hidden p-0">
            <CountryList
              items={COUNTRY_DATA}
              onSelect={(code) => {
                onChange(code as RPNInput.Country);
                setOpen(false);
              }}
              search={deferredSearch}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="w-5 overflow-hidden rounded">
      {Flag ? <Flag title={countryName} /> : <PhoneIcon aria-hidden="true" size={16} />}
    </span>
  );
};
