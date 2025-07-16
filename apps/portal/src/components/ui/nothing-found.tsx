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
    <div className="bg-background absolute inset-0 flex flex-col items-center justify-center gap-3 py-9">
      <Image
        src="/not-available.svg"
        height={200}
        width={200}
        alt="No Cards Available"
      />

      <p className="text-muted-foreground pt-2 font-semibold">
        No Cards or Company Available
      </p>
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
