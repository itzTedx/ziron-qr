import z from "zod";

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
