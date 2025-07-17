"use client";

import React, { useId } from "react";

import { ChevronDownIcon, PhoneIcon } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import en from "react-phone-number-input/locale/en.json";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ziron/ui/components/command";
import { Input } from "@ziron/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ziron/ui/components/popover";
import { cn } from "@ziron/utils";

export type PhoneInputProps = {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  className?: string;
  id?: string;
  placeholder?: string;
  countrySelectProps?: Partial<CountrySelectProps>;
  disabled?: boolean;
};

export function PhoneInput({
  value,
  onChange,
  onBlur,
  name,
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
      className={cn("flex rounded-md shadow-xs", className)}
      international
      flagComponent={FlagComponent}
      countrySelectComponent={(props) => (
        <CountrySelect {...props} {...countrySelectProps} />
      )}
      inputComponent={PlainInput as any}
      id={inputId}
      placeholder={placeholder}
      value={value}
      onChange={(newValue) => {
        onChange(newValue ?? "");
      }}
      disabled={disabled}
    />
  );
}
PhoneInput.displayName = "PhoneInput";

const PlainInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, type, ...props }, ref) => (
  <Input
    ref={ref}
    data-slot="phone-input"
    className={cn(
      "-ms-px w-full rounded-s-none rounded-e-none border-r-0 shadow-none focus-visible:z-10",
      className,
    )}
    {...props}
  />
));
PlainInput.displayName = "PlainInput";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
};

const CountrySelect = ({ disabled, value, onChange }: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);
  const countries = React.useMemo(() => getCountries(), []);
  const selected = value;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "border-input dark:bg-input/30 text-muted-foreground hover:bg-accent hover:text-foreground relative inline-flex items-center self-stretch rounded-s-md border bg-transparent py-2 ps-3 pe-2 transition-[color,box-shadow] outline-none focus-within:z-10 focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50",
            disabled && "pointer-events-none opacity-50",
          )}
          disabled={disabled}
        >
          <span className="inline-flex items-center gap-1">
            <FlagComponent
              country={selected}
              countryName={selected}
              aria-hidden="true"
            />

            <ChevronDownIcon aria-hidden="true" className="size-3" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandList className="max-h-60 overflow-auto">
            {countries.map((country) => (
              <CommandItem
                key={country}
                value={en[country]}
                onSelect={() => {
                  onChange(country as RPNInput.Country);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2"
              >
                <FlagComponent
                  country={country}
                  countryName={en[country]}
                  aria-hidden="true"
                />
                <span className="text-sm">{en[country]}</span>
                <span className="text-muted-foreground ml-auto text-xs">
                  +{getCountryCallingCode(country)}
                </span>
              </CommandItem>
            ))}
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
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <PhoneIcon size={16} aria-hidden="true" />
      )}
    </span>
  );
};
