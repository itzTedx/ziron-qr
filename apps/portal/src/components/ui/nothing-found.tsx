"use client";

import Image from "next/image";

import { IconPlus } from "@tabler/icons-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@ziron/ui/components/button";

export const NothingFound = () => {
  const [_, setCompanyModal] = useQueryStates({
    modal: parseAsString,
  });

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background py-9">
      <Image alt="No Cards Available" height={200} src="/not-available.svg" width={200} />

      <p className="pt-2 font-semibold text-muted-foreground">No Cards or Company Available</p>
      <Button
        className="gap-2"
        onClick={() => {
          setCompanyModal({ modal: "company" });
        }}
      >
        <IconPlus className="size-4" /> Add Company
      </Button>
    </div>
  );
};
