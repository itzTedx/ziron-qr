import { z } from "zod";

export const LabelEnum = z.enum(["Primary", "Work", "Personal"]);

const appearanceSchema = z.object({
  template: z.string(),
  theme: z.string().optional(),
  btnColor: z.string().optional(),
  isDarkMode: z.boolean().optional(),
});
const phonesSchema = z
  .array(
    z.object({
      id: z.string().optional(),
      phone: z
        .string({ message: "Invalid phone number" })
        .min(6, { message: "Phone number too short" })
        .max(20, { message: "Phone number too long" })
        .optional(),
      label: LabelEnum,
    })
  )
  .optional();

export type PhonesType = z.infer<typeof phonesSchema>;

const emailsSchema = z
  .array(
    z.object({
      id: z.string().optional(),
      email: z.email({ message: "Invalid email address" }).optional(),
      label: LabelEnum,
    })
  )
  .optional();

export type EmailsType = z.infer<typeof emailsSchema>;

const linksSchema = z.array(
  z.object({
    id: z.string().optional(),
    label: z.string().min(1, { message: "Please enter title for the link" }),
    url: z.url({ message: "Please enter a valid URL" }),
    icon: z.string(),
    category: z.string().optional(),
  })
);

export const cardSchema = z
  .object({
    // Core card information
    id: z.string().optional(),
    name: z.string().min(2, { message: "Please enter full name" }).max(256, { message: "Name is too long" }),
    bio: z.string().optional(),
    designation: z.string().optional(),
    companyId: z.string(),

    // Contact information
    phones: phonesSchema.optional(),
    emails: emailsSchema.nullish(),
    address: z.string().optional(),
    mapUrl: z.string().optional(),

    // Media and attachments
    image: z.string().optional(),
    cover: z.string().optional(),
    attachmentUrl: z.url().optional().nullish(),
    attachmentFileName: z.string().optional().nullish(),

    // SEO and routing
    slug: z.string().optional(),

    // Social and business links
    links: linksSchema.optional(),

    // Styling and appearance
    appearance: appearanceSchema,
  })
  .describe(
    "Validates card data: core info (name, bio, designation, companyId), contact details (phones, emails, address), media (image, cover, attachments), links, and styling preferences."
  );

export type zCardSchema = z.infer<typeof cardSchema>;
