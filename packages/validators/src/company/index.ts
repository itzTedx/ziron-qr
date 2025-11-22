import { z } from "zod/v4";

export const companySchema = z
  .object({
    name: z.string().min(2, { message: "Please enter company name" }).max(100, { message: "Company name too long" }),
    phone: z
      .string()
      .min(6, { message: "Please enter a valid phone number" })
      .max(20, { message: "Phone number too long" }),
    website: z
      .string({
        message: "Please enter a valid website URL ",
      })
      .regex(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/, {
        message: "Please enter a valid website URL ",
      })
      .optional(),
    address: z.string().min(6, { message: "Please enter address" }),
    logo: z.string().optional(),
  })
  .describe(
    "Validates company data: id (optional), name (2-100 chars), phone (6-20 chars), website (optional), address (min 6 chars), logo (required)."
  );

export type CompanyType = z.infer<typeof companySchema>;
