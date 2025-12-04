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
      <ResponsiveModalContent className="sm:max-w-lg">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>{fields.name ? `Edit ${fields.name}` : "Create a Organization"}</ResponsiveModalTitle>
        </ResponsiveModalHeader>
        <div className="mx-auto max-w-md p-6">
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
