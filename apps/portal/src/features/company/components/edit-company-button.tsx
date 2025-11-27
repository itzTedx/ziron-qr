"use client";

import { IconEdit } from "@tabler/icons-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@ziron/ui/components/button";

import { Company } from "@ziron/db/schema";

interface EditButtonProps {
  initialData: Company;
}

export function EditCompanyButton({ initialData }: EditButtonProps) {
  const [, setCompanyModal] = useQueryStates({
    modal: parseAsString,
  });

  const [, setFields] = useQueryStates({
    id: parseAsString,
    name: parseAsString,
    logo: parseAsString,
    address: parseAsString,
    phone: parseAsString,
    website: parseAsString,
  });

  return (
    <Button
      onClick={() => {
        setCompanyModal({ modal: "company" });
        setFields({
          id: initialData.id ?? "",
          name: initialData.name ?? "",
          address: initialData.address ?? "",
          phone: initialData.phone ?? "",
          website: initialData.website ?? "",
          logo: initialData.logo ?? "",
        });
      }}
      size="icon"
      variant="outline"
    >
      <IconEdit className="size-4" />
    </Button>
  );
}
