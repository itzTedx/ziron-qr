import { useCallback, useEffect, useMemo, useState } from "react";

import Image from "next/image";

import { IconCaretUpDownFilled, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryStates } from "nuqs";

import { AnimatedSizeContainer } from "@ziron/ui/components/animated-size-container";
import { Button } from "@ziron/ui/components/button";
import { Command, CommandInput, CommandItem, CommandList } from "@ziron/ui/components/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, useFormContext } from "@ziron/ui/components/form";
import { Popover, PopoverContent, PopoverTrigger } from "@ziron/ui/components/popover";
import { useKeyboardShortcut, useMediaQuery } from "@ziron/ui/hooks";

import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

import { orpc } from "@/lib/orpc/client";

interface Props {
	organizationId?: string;
}

export const OrganizationField = ({ organizationId }: Props) => {
	const [openPopover, setOpenPopover] = useState(false);
	const [search, setSearch] = useState("");
	const [commandValue, setCommandValue] = useState<string>("");
	const [, setOrganizationModal] = useQueryStates({
		modal: parseAsString,
		name: parseAsString,
	});

	const { isMobile } = useMediaQuery();

	const { data } = useQuery(orpc.organization.list.queryOptions());
	const form = useFormContext<zCardSchema>();

	// Memoize organization lookup
	const selectedOrganization = useMemo(() => {
		return data?.find((org) => org.id === organizationId);
	}, [data, organizationId]);

	// Set command value to selected organization when popover opens
	useEffect(() => {
		if (openPopover && selectedOrganization) {
			setCommandValue(selectedOrganization.name);
			setSearch("");
		} else if (!openPopover) {
			setCommandValue("");
			setSearch("");
		}
	}, [openPopover, selectedOrganization]);

	// Memoize organization selection handler
	const handleSelect = (organizationId?: string) => {
		if (organizationId) {
			form.setValue("organizationId", organizationId, { shouldDirty: true });
			setOpenPopover(false);
		}
	};

	const matchTriggerWidth = true;

	// Memoize organization modal handler
	const handleModalOpen = useCallback(() => {
		setOpenPopover(false);
		setOrganizationModal({ modal: "organization", name: search });
	}, [search, setOrganizationModal]);

	useKeyboardShortcut("o", () => setOpenPopover(true));

	return (
		<FormField
			control={form.control}
			name="organizationId"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Organization</FormLabel>

					<Popover onOpenChange={setOpenPopover} open={openPopover}>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									className={cn(
										"w-full justify-between border-input-border bg-input text-foreground hover:bg-input hover:brightness-120",
										!field.value && "text-muted-foreground"
									)}
									role="combobox"
									variant="outline"
								>
									{selectedOrganization ? (
										<span className="inline-flex items-center gap-2.5">
											<div className="relative aspect-square size-4">
												<Image
													alt={`${selectedOrganization.name} logo`}
													className="object-contain"
													fill
													src={selectedOrganization.logo || "/images/placeholder-cover.jpg"}
												/>
											</div>
											<span>{selectedOrganization.name}</span>
										</span>
									) : (
										"Select Organization"
									)}
									<IconCaretUpDownFilled className="ml-2 size-3 shrink-0 opacity-40" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent
							align="start"
							className={cn(matchTriggerWidth && "sm:w-(--radix-popover-trigger-width)")}
						>
							<AnimatedSizeContainer
								className="pointer-events-auto"
								height
								style={{ transform: "translateZ(0)" }}
								transition={{ ease: "easeInOut", duration: 0.1 }} // Fixes overflow on some browsers
								width={!isMobile && !matchTriggerWidth}
							>
								<Command loop onValueChange={setCommandValue} value={commandValue}>
									<CommandInput
										onKeyDown={(e) => {
											if (e.key === "Escape" || (e.key === "Backspace" && !search)) {
												e.preventDefault();
												e.stopPropagation();
												setOpenPopover(false);
											}
										}}
										onValueChange={setSearch}
										placeholder="Search or Add Organization..."
										shortcutHint="O"
										value={search}
									/>

									<CommandList className="max-h-[300px] overflow-auto p-1">
										{data?.map((org) => (
											<CommandItem
												className="cursor-pointer gap-2.5 px-3 py-2.5 font-medium"
												key={org.id}
												onSelect={() => handleSelect(org.id)}
												value={org.name}
											>
												<Image
													alt={`${org.name} logo`}
													height={16}
													loading="lazy"
													src={org.logo || "/images/placeholder-cover.jpg"}
													width={16}
												/>
												<span>{org.name}</span>
											</CommandItem>
										))}
										{/* <Button className="w-full justify-start" onClick={handleModalOpen} size="sm" variant="ghost"> */}
										{search.length > 0 && (
											<CommandItem onSelect={handleModalOpen}>
												<IconPlus /> Create {search}
											</CommandItem>
										)}
										{/* </Button> */}
									</CommandList>
								</Command>
							</AnimatedSizeContainer>
						</PopoverContent>
					</Popover>

					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
