"use client";

import { IconEdit } from "@tabler/icons-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@ziron/ui/components/button";

import { Organization } from "@ziron/db/schema";

interface EditButtonProps {
	initialData: Organization;
}

export function EditOrganizationButton({ initialData }: EditButtonProps) {
	const [, setOrganizationModal] = useQueryStates({
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
				setOrganizationModal({ modal: "organization" });
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
