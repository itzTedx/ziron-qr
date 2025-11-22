import type { CardType } from "@ziron/db/schema";
import type { zCardSchema } from "@ziron/validators";

function nullToUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}

export function transformCardData(initialData?: CardType, companyId?: string | null): Partial<zCardSchema> {
  return {
    id: initialData?.id ?? undefined,
    name: initialData?.name ?? "",
    emails: initialData?.emails
      ? initialData.emails.map((email) => ({
          id: email.id ?? undefined,
          email: nullToUndefined(email.email),
          label:
            email.label === "Primary" || email.label === "Work" || email.label === "Personal" ? email.label : "Primary",
        }))
      : [{ email: undefined, label: "Primary" }],
    phones: initialData?.phones
      ? initialData.phones.map((phone) => ({
          id: phone.id ?? undefined,
          phone: nullToUndefined(phone.phone),
          label:
            phone.label === "Primary" || phone.label === "Work" || phone.label === "Personal" ? phone.label : "Primary",
        }))
      : [{ phone: undefined, label: "Primary" }],
    address: nullToUndefined(initialData?.address),
    mapUrl: nullToUndefined(initialData?.mapUrl),
    companyId: initialData?.companyId ?? companyId ?? "",
    designation: nullToUndefined(initialData?.designation),
    bio: nullToUndefined(initialData?.bio),
    appearance: {
      template: initialData?.styles?.template ?? "default",
      theme: initialData?.styles?.theme ?? "#4938ff",
      btnColor: initialData?.styles?.btnColor ?? "#4938ff",
      isDarkMode: initialData?.styles?.isDarkMode ?? false,
    },
    image: initialData?.image ?? undefined,
    cover: initialData?.cover ?? undefined,
    attachmentUrl: nullToUndefined(initialData?.attachmentUrl),
    attachmentFileName: nullToUndefined(initialData?.attachmentFileName),
    slug: initialData?.slug ?? undefined,
  };
}
