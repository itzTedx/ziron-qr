"use client";

import { IconEdit } from "@tabler/icons-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Company } from "@ziron/db/schema";
import { Button } from "@ziron/ui/components/button";

interface EditButtonProps {
  initialData: Company;
}

export default function EditCompanyButton({ initialData }: EditButtonProps) {
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
      size="icon"
      variant="outline"
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
    >
      <IconEdit className="size-4" />
    </Button>
  );
}
