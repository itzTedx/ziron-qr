"use client";

import { parseAsString, useQueryStates } from "nuqs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ziron/ui/components/dialog";

import CompanyForm from "./company-form";

export default function CompanyFormModal() {
  const [modal, setCompanyModal] = useQueryStates({
    modal: parseAsString,
  });
  const [fields, setFields] = useQueryStates({
    id: parseAsString,
    name: parseAsString,
    logo: parseAsString,
    address: parseAsString,
    phone: parseAsString,
    website: parseAsString,
  });

  return (
    <Dialog
      open={modal.modal === "company"}
      onOpenChange={(v) => {
        if (!v) setCompanyModal({ modal: null });
        setFields({
          id: null,
          name: null,
          logo: null,
          address: null,
          phone: null,
          website: null,
        });
      }}
    >
      <DialogContent className="min-w-xl p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle>
            {fields.name ? `Edit ${fields.name}` : "Add New Company"}
          </DialogTitle>
        </DialogHeader>
        <CompanyForm
          initialData={{
            id: fields.id ?? undefined,
            name: fields.name ?? "",
            address: fields.address ?? "",
            phone: fields.phone ?? "",
            website: fields.website ?? "",
            logo: fields.logo ?? "",
          }}
          isEditMode={!!fields.name}
        />
      </DialogContent>
    </Dialog>
  );
}
