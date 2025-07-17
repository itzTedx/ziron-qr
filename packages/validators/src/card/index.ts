import { z } from "zod/v4";

export const cardSchema = z
  .object({
    // Core card information
    id: z.uuid().optional(),
    name: z
      .string()
      .min(2, { message: "Please enter full name" })
      .max(256, { message: "Name is too long" }),
    bio: z.string().optional(),
    designation: z.string().optional(),
    companyId: z.string(),

    // Contact information
    phones: z
      .array(
        z.object({
          id: z.string().optional(),
          phone: z
            .string({ message: "Invalid phone number" })
            .min(6, { message: "Phone number too short" })
            .max(20, { message: "Phone number too long" })
            .optional(),
          label: z.string().default("primary"),
        }),
      )
      .optional(),
    emails: z
      .array(
        z.object({
          id: z.string().optional(),
          email: z.email({ message: "Invalid email address" }).optional(),
          label: z.string().default("primary"),
        }),
      )
      .optional(),
    address: z.string().min(6, { message: "Please enter address" }).optional(),
    mapUrl: z.url().min(6, { message: "Please copy link from map" }).optional(),

    // Media and attachments
    image: z.string().optional(),
    cover: z.string().optional(),
    attachmentUrl: z.url().optional().nullish(),
    attachmentFileName: z.string().optional().nullish(),

    // SEO and routing
    slug: z.string().optional(),

    // Social and business links
    links: z
      .array(
        z.object({
          id: z.string().optional(),
          label: z
            .string()
            .min(1, { message: "Please enter title for the link" }),
          url: z.url({ message: "Please enter a valid URL" }),
          icon: z.string(),
          category: z.string().optional(),
        }),
      )
      .optional(),

    // Styling and appearance
    template: z.string().optional().default("default"),
    theme: z.string().optional().default("#4938ff"),
    btnColor: z.string().optional().default("#4938ff"),
    isDarkMode: z.boolean().optional().default(false),
  })
  .describe(
    "Validates card data: core info (name, bio, designation, companyId), contact details (phones, emails, address), media (image, cover, attachments), links, and styling preferences.",
  );

export type zCardSchema = z.infer<typeof cardSchema>;
