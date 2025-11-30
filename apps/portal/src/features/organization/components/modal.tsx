"use client";

import { parseAsString, useQueryStates } from "nuqs";

import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";

import OrganizationForm from "./organization-form";

export default function OrganizationFormModal() {
  const [modal, setOrganizationModal] = useQueryStates({
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
    <ResponsiveModal
      onOpenChange={(v) => {
        if (!v) setOrganizationModal({ modal: null });
        setFields({
          id: null,
          name: null,
          logo: null,
          address: null,
          phone: null,
          website: null,
        });
      }}
      open={modal.modal === "organization"}
    >
      <ResponsiveModalContent className="p-0 sm:max-w-xl">
        <ResponsiveModalHeader className="border-b p-6">
          <ResponsiveModalTitle>{fields.name ? `Edit ${fields.name}` : "Add New Organization"}</ResponsiveModalTitle>
        </ResponsiveModalHeader>
        <div className="p-6 pt-0">
          <OrganizationForm
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
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
