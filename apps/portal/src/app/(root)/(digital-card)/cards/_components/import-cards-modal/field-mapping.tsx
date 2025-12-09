"use client";

import { useEffect, useMemo, useState } from "react";

import { ArrowRight, Check, ChevronDown, TableIcon, X } from "lucide-react";
import { Control, Controller, Path, UseFormSetValue, UseFormWatch } from "react-hook-form";

import { Button } from "@ziron/ui/components/button";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { Popover, PopoverContent, PopoverTrigger } from "@ziron/ui/components/popover";

import { cn, formatDate, parseDateTime, truncate } from "@ziron/utils";
import { ImportCardType } from "@ziron/validators";

import { Tooltip } from "@/components/shared/tooltip";

import { IconMenu } from "../card-sort";

const mappableFields = {
	name: { label: "Name", required: true },
	email: { label: "Email", required: false },
	phone: { label: "Phone", required: false },
	address: { label: "Address", required: false },
	mapUrl: { label: "Map URL", required: false },
	designation: { label: "Designation", required: false },
	bio: { label: "Bio", required: false },
	links: { label: "Links", required: false },
	image: { label: "Image", required: false },
	cover: { label: "Cover", required: false },
	attachmentUrl: { label: "Attachments", required: false },
	slug: { label: "Slug", required: false },
	appearance: { label: "Appearance", required: false },
	createdAt: { label: "Created At", required: false },
} as const;

/**
 * Normalizes a string for comparison by converting to lowercase,
 * removing special characters, and trimming whitespace
 */
function normalizeString(str: string): string {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]/g, "");
}

/**
 * Calculates similarity score between two strings (0-1)
 * Higher score means more similar
 */
function calculateSimilarity(str1: string, str2: string): number {
	const normalized1 = normalizeString(str1);
	const normalized2 = normalizeString(str2);

	// Exact match after normalization
	if (normalized1 === normalized2) return 1.0;

	// One contains the other
	if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
		return 0.8;
	}

	// Check if they start with the same characters
	const minLength = Math.min(normalized1.length, normalized2.length);
	let commonStart = 0;
	for (let i = 0; i < minLength; i++) {
		if (normalized1[i] === normalized2[i]) {
			commonStart++;
		} else {
			break;
		}
	}
	if (commonStart >= 3) {
		return 0.6;
	}

	// Check for common words
	const words1 = normalized1.split(/\s+/);
	const words2 = normalized2.split(/\s+/);
	const commonWords = words1.filter((w) => words2.includes(w));
	if (commonWords.length > 0) {
		return 0.4;
	}

	return 0;
}

type MappableFieldsType = typeof mappableFields;

/**
 * Maps CSV column names to field names automatically
 */
function autoMapFields(
	fileColumns: string[],
	fields: MappableFieldsType
): Partial<Record<keyof MappableFieldsType, string>> {
	const mappings: Partial<Record<keyof MappableFieldsType, string>> = {};
	const usedColumns = new Set<string>();

	// First pass: exact matches (case-insensitive, ignoring special chars)
	for (const [fieldKey, fieldConfig] of Object.entries(fields)) {
		const fieldLabel = fieldConfig.label.toLowerCase();
		const normalizedFieldLabel = normalizeString(fieldLabel);

		for (const column of fileColumns) {
			if (usedColumns.has(column)) continue;

			const normalizedColumn = normalizeString(column);

			// Exact match
			if (normalizedColumn === normalizedFieldLabel) {
				mappings[fieldKey as keyof MappableFieldsType] = column;
				usedColumns.add(column);
				break;
			}
		}
	}

	// Second pass: fuzzy matches for unmapped fields
	for (const [fieldKey, fieldConfig] of Object.entries(fields)) {
		if (mappings[fieldKey as keyof MappableFieldsType]) continue; // Already mapped

		const fieldLabel = fieldConfig.label;
		let bestMatch: { column: string; score: number } | null = null;

		for (const column of fileColumns) {
			if (usedColumns.has(column)) continue;

			const score = calculateSimilarity(column, fieldLabel);
			if (score > 0.3 && (!bestMatch || score > bestMatch.score)) {
				bestMatch = { column, score };
			}
		}

		if (bestMatch) {
			mappings[fieldKey as keyof MappableFieldsType] = bestMatch.column;
			usedColumns.add(bestMatch.column);
		}
	}

	// Third pass: common variations and aliases
	const aliases: Record<string, string[]> = {
		name: ["full name", "fullname", "contact name", "person name", "card name"],
		email: ["e-mail", "email address", "e mail"],
		phone: ["telephone", "mobile", "cell", "phone number", "contact number"],
		address: ["location", "street", "street address"],
		mapUrl: ["map", "map url", "google maps", "maps"],
		designation: ["title", "job title", "position", "role"],
		bio: ["biography", "description", "about", "about me"],
		image: ["photo", "picture", "avatar", "profile picture", "profile image"],
		cover: ["cover image", "cover photo", "banner"],
		attachmentUrl: ["attachment", "attachments", "file", "files"],
		slug: ["url slug", "permalink"],
		createdAt: ["created", "date created", "creation date", "date"],
	};

	for (const [fieldKey, fieldAliases] of Object.entries(aliases)) {
		if (mappings[fieldKey as keyof MappableFieldsType]) continue; // Already mapped

		for (const alias of fieldAliases) {
			for (const column of fileColumns) {
				if (usedColumns.has(column)) continue;

				const normalizedColumn = normalizeString(column);
				const normalizedAlias = normalizeString(alias);

				if (normalizedColumn === normalizedAlias || normalizedColumn.includes(normalizedAlias)) {
					mappings[fieldKey as keyof MappableFieldsType] = column;
					usedColumns.add(column);
					break;
				}
			}
			if (mappings[fieldKey as keyof MappableFieldsType]) break;
		}
	}

	return mappings;
}

export function FieldMapping({
	control,
	watch,
	setValue,
	fileColumns,
	firstRows,
}: {
	control: Control<ImportCardType>;
	watch: UseFormWatch<ImportCardType>;
	setValue: UseFormSetValue<ImportCardType>;
	fileColumns: string[] | null;
	firstRows: Record<string, string>[] | null;
}) {
	const [isStreaming] = useState(false);

	useEffect(() => {
		if (!fileColumns || !firstRows) return;

		// Auto-map CSV columns to fields
		const mappings = autoMapFields(fileColumns, mappableFields);

		// Set form values for all mapped fields
		const currentFields = watch("fields") || {};
		const updatedFields = { ...currentFields };

		for (const [fieldKey, columnName] of Object.entries(mappings)) {
			if (columnName) {
				updatedFields[fieldKey] = columnName;
			}
		}

		// Only update if there are new mappings
		if (Object.keys(mappings).length > 0) {
			setValue("fields", updatedFields, { shouldValidate: true });
		}
		// Note: setValue and watch are stable functions from react-hook-form
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fileColumns, firstRows, setValue, watch]);

	return (
		<div className="grid grid-cols-[1fr_min-content_1fr] gap-x-4 gap-y-2">
			{(Object.keys(mappableFields) as (keyof typeof mappableFields)[]).map((field) => (
				<FieldRow
					control={control}
					field={field}
					fileColumns={fileColumns}
					firstRows={firstRows}
					isStreaming={isStreaming}
					key={field}
					watch={watch}
				/>
			))}
		</div>
	);
}

function FieldRow({
	field,
	isStreaming,
	watch,
	firstRows,
	control,
	fileColumns,
}: {
	field: keyof typeof mappableFields;
	isStreaming: boolean;
	watch: UseFormWatch<ImportCardType>;
	firstRows: Record<string, string>[] | null;
	control: Control<ImportCardType>;
	fileColumns: string[] | null;
}) {
	const fields = watch("fields");
	const value = fields?.[field] ?? null;
	const fieldConfig = mappableFields[field];
	const label = fieldConfig.label;
	const required = fieldConfig.required;

	const isLoading = isStreaming && !value;
	const [isOpen, setIsOpen] = useState(false);

	const examples = useMemo(() => {
		if (!firstRows || !value || typeof value !== "string") return [];

		let values = firstRows.map((row) => row[value]).filter(Boolean);

		switch (field) {
			case "createdAt":
				// Convert to date
				values = values
					.map((e) => {
						if (!e) return null;
						const date = parseDateTime(e);
						if (!date) return e;

						return formatDate(date, {
							showYear: true,
						});
					})
					.filter((e): e is string => e !== null);
				break;
		}

		values = values.map((e) => truncate(e, 32) as string);

		return values;
	}, [firstRows, value, field]);

	return (
		<>
			<div className="relative flex min-w-0 items-center gap-2">
				<Controller
					control={control}
					name={`fields.${field}` as Path<ImportCardType>}
					render={({ field: controllerField }) => {
						const fieldValue = typeof controllerField.value === "string" ? controllerField.value : null;
						return (
							<Popover onOpenChange={setIsOpen} open={isOpen}>
								<PopoverTrigger asChild>
									<Button
										className="h-9 w-full min-w-0 items-start justify-start px-3 text-start"
										disabled={isLoading}
										onClick={() => setIsOpen((o) => !o)}
										variant="outline"
									>
										<LoadingSwap
											className="flex w-full grow items-center justify-between gap-1"
											isLoading={isLoading}
										>
											<span className="flex-1 truncate whitespace-nowrap text-left">
												{fieldValue ? fieldValue : <span>Select column...</span>}
											</span>
											<ChevronDown className="size-4 shrink-0 text-neutral-400 transition-transform duration-75 group-data-[state=open]:rotate-180" />
										</LoadingSwap>
									</Button>
								</PopoverTrigger>
								<PopoverContent align="end" className="w-full p-2 md:w-48">
									{[...(fileColumns || []), ...(fieldValue && !required ? ["None"] : [])]?.map(
										(column) => {
											const Icon = column !== "None" ? TableIcon : X;
											return (
												<button
													className={cn(
														"flex w-full items-center justify-between space-x-2 rounded-md px-1 py-2 hover:bg-faded active:bg-faded",
														column === "None" && "text-muted-foreground"
													)}
													key={column}
													onClick={() => {
														controllerField.onChange(column !== "None" ? column : null);
														setIsOpen(false);
													}}
												>
													<IconMenu
														icon={<Icon className="size-4 flex-none" />}
														text={column}
													/>
													{fieldValue === column && <Check className="size-4 shrink-0" />}
												</button>
											);
										}
									)}
								</PopoverContent>
							</Popover>
						);
					}}
					rules={required ? { required: "This field is required" } : undefined}
				/>
			</div>
			{Boolean(examples?.length) ? (
				<Tooltip
					content={
						<div className="block px-4 py-3 text-sm">
							<span className="font-medium text-neutral-950">Example values:</span>
							<ul className="mt-0.5">
								{examples
									?.filter((example): example is string => Boolean(example))
									.map((example, idx) => (
										<li
											className="block text-neutral-500 text-xs leading-tight"
											key={example + idx + field}
										>
											<span className="translate-y-1 text-base text-neutral-600">&bull;</span>{" "}
											{example}
										</li>
									))}
							</ul>
						</div>
					}
				>
					<div className="flex items-center justify-end">
						<ArrowRight className="size-4 text-muted-foreground" />
					</div>
				</Tooltip>
			) : (
				<div className="flex items-center justify-end">
					<ArrowRight className="size-4 text-neutral-500" />
				</div>
			)}
			<span className="flex h-9 items-center gap-1 rounded-md border bg-muted px-3">
				<span className="grow whitespace-nowrap font-normal text-foreground/70 text-sm">
					{label} {required && <span className="text-red-700">*</span>}
				</span>
			</span>
		</>
	);
}
