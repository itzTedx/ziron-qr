import { z } from "zod";

import { cardSchema } from "./index";

export const columns = [
	{
		id: "name",
		label: "Name",
		default: true,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "email",
		label: "Email",
		default: true,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "phone",
		label: "Phone",
		default: true,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "address",
		label: "Address",
		default: false,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "mapUrl",
		label: "Map URL",
		default: false,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "designation",
		label: "Designation",
		default: true,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "bio",
		label: "Bio",
		default: false,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "links",
		label: "Links",
		default: false,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "image",
		label: "Image",
		default: true,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "cover",
		label: "Cover",
		default: false,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "attachmentUrl",
		label: "Attachments",
		default: false,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "slug",
		label: "Slug",
		default: true,
		transform: (value: unknown) => String(value ?? ""),
	},
	{
		id: "appearance",
		label: "Appearance",
		default: false,
		transform: (value: unknown) => String(value ?? ""),
	},
] as const;

export type ExportCardColumn = (typeof columns)[number];

export const exportCardColumnsDefault = columns.filter((column) => column.default).map((column) => column.id);

export const exportCardSchema = z.object({
	dateRange: z.object({
		from: z.date().optional().describe("The start date of creation to retrieve links from."),
		to: z.date().optional().describe("The end date of creation to retrieve cards from."),
		interval: z.string().optional().describe("The interval for the export."),
	}),
	columns: z
		.array(z.string())
		.min(1, "Please select at least one column")
		.refine((value) => value.every((columnId) => columns.some((col) => col.id === columnId)), {
			message: "You selected an invalid column",
		}),

	useFilters: z.boolean().optional(),
});

export type ExportCardType = z.infer<typeof exportCardSchema>;

// Valid field names that can be mapped from CSV columns
const mappableFieldNames = [
	"name",
	"email",
	"phone",
	"address",
	"mapUrl",
	"designation",
	"bio",
	"links",
	"image",
	"cover",
	"attachmentUrl",
	"slug",
	"appearance",
] as const;

export const importCardSchema = z.object({
	file: z.instanceof(File).refine((file) => file.type === "text/csv", {
		message: "Please select a CSV file",
	}),
	// Field mappings - each field maps to a CSV column name (or null if not mapped)
	// Only allow valid card schema field names
	fields: z.record(z.string(), z.string().nullable()).refine(
		(fields) => {
			const fieldKeys = Object.keys(fields);
			return fieldKeys.every((key) => mappableFieldNames.includes(key as (typeof mappableFieldNames)[number]));
		},
		{
			message: "Invalid field name in mappings",
		}
	),
});

export type ImportCardType = z.infer<typeof importCardSchema>;

/**
 * Schema for validating a single CSV row after transformation to card data
 * Uses the cardSchema to ensure all data conforms to the expected structure
 */
export const importCardRowSchema = cardSchema;

/**
 * Schema for validating an array of CSV rows
 */
export const importCardRowsSchema = z.array(importCardRowSchema).min(1, "At least one valid card is required");
