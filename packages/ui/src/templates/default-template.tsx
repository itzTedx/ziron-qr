import Image from "next/image";
import Link from "next/link";

import { IconBuildingSkyscraper, IconMail, IconPhone, IconPinned } from "@tabler/icons-react";

import { CardType, Company } from "@ziron/db/schema";
import { cn, getTextColorByBackground, removeExtension } from "@ziron/utils";

import { Icons } from "../assets/icons";
import SaveContactButton from "../components/save-contact-button";

interface TemplateProps {
  card?: CardType;
  company?: Company[];
  imageBase64URI?: string;
}

export default function DefaultTemplate({ card, company, imageBase64URI }: TemplateProps) {
  if (!card) return null;

  const companyData = company?.find((c) => c.id === card.companyId);

  const textColor = getTextColorByBackground(card.styles?.btnColor || "#4938ff");

  const theme = card.styles?.theme || "#4938ff";

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col justify-between",
        card.styles?.isDarkMode ? "dark bg-background text-foreground" : "bg-white text-black"
      )}
    >
      <div className="no-scrollbar">
        <header className="w-full">
          <div className="relative">
            <div className="flex @sm:h-36 h-24 w-full items-start justify-center pt-4">
              {card.cover && (
                <Image
                  alt="cover"
                  className="object-cover"
                  fill
                  src={`${card.cover ? card.cover : "/images/placeholder-cover.jpg"}`}
                />
              )}
            </div>
            {card.image && (
              <div className="-translate-x-1/2 absolute top-1/2 left-1/2 @sm:size-32 size-24 overflow-hidden rounded-full border-4 border-background bg-gray-100">
                <Image alt="" className="object-cover" fill sizes="20vw" src={card.image} />

                {card.company && card.company.logo && (
                  <>
                    <Image
                      alt="cover"
                      className="-translate-x-1/2 absolute bottom-3 left-1/2 z-30 h-5 object-contain"
                      height={100}
                      src={card.company.logo}
                      width={100}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-background/50 to-transparent" />
                  </>
                )}
              </div>
            )}
          </div>
          <section className={cn("space-y-0.5 px-8 py-4 text-center", card.image ? "@sm:mt-12 mt-8" : "")}>
            {card.name && <h1 className="font-bold @sm:text-2xl text-xl">{card.name}</h1>}
            {card.designation && <h2 className="@sm:text-sm text-xs">{card.designation}</h2>}
            {card.bio && <p className="text-balance @sm:text-xs text-[10px]">{card.bio}</p>}
          </section>
        </header>

        {card.company || card.emails || card.phones || card.address ? (
          <section className="border-y @sm:px-6 px-4 @sm:py-4 py-3">
            <h2 className="pb-3 font-medium @sm:text-sm text-gray-600 text-xs">Contact Info</h2>

            <div className="@sm:space-y-6 space-y-3">
              {card.company || companyData ? (
                <Link
                  className="flex items-center gap-2 @sm:text-base text-sm"
                  href={card.company && card.company.website ? card.company.website : "#"}
                  target="_blank"
                >
                  <IconBuildingSkyscraper className="@sm:size-5 size-4 shrink-0 stroke-[1.5]" />
                  {companyData?.name || card.company?.name}
                </Link>
              ) : null}
              {card.emails &&
                card.emails[0]?.email &&
                card.emails.map((email, i) => (
                  <Link
                    className="flex items-center gap-2 @sm:text-base text-sm"
                    href={`mailto:${email.email}`}
                    key={`${i + 1}-${email.email}`}
                  >
                    <IconMail className="@sm:size-5 size-4 shrink-0 stroke-[1.5]" />
                    {email.email}
                  </Link>
                ))}
              {card.phones &&
                card.phones[0]?.phone &&
                card?.phones.map((phone, i) => (
                  <Link
                    className="flex items-center gap-2 @sm:text-base text-sm"
                    href={`tel:${phone.phone}`}
                    key={`${i + 1}-${phone.phone}`}
                  >
                    <IconPhone className="@sm:size-5 size-4 shrink-0 stroke-[1.5]" />
                    {phone.phone}
                  </Link>
                ))}

              {card.address && (
                <Link className="flex items-start gap-2 @sm:text-base text-sm" href={card.mapUrl ?? "#"}>
                  <IconPinned className="mt-1.5 @sm:size-5 size-4 shrink-0 stroke-[1.5]" />
                  {card.address}
                </Link>
              )}
            </div>
          </section>
        ) : null}
        {card.links && card.links.length > 0 && (
          <section className="@sm:space-y-4 space-y-3 @sm:px-8 px-4">
            <h2 className="pt-3 font-medium text-gray-600 text-sm">Links</h2>
            <div className="space-y-4">
              {card.links.map((link, index) => (
                <Link
                  className="flex items-center gap-2 rounded-md border p-3 @sm:text-base text-sm"
                  href={link.url || "#"}
                  key={`${index}-${link.url}`}
                  target="_blank"
                >
                  <div className="relative size-8 shrink-0">
                    <Image alt="" fill sizes="10vw" src={link.icon} />
                  </div>
                  <h5 className="font-semibold">{link.label}</h5>
                </Link>
              ))}
            </div>
          </section>
        )}
        {card.attachmentUrl && card.attachmentFileName && (
          <section className="@sm:space-y-4 space-y-3 @sm:px-8 px-4">
            <h2 className="pt-3 font-medium text-gray-600 text-sm">Attachment</h2>
            <div className="space-y-4">
              <Link
                className="flex items-center gap-2 rounded-md border p-3 @sm:text-base text-sm"
                download
                href={card.attachmentUrl}
              >
                <div className="relative size-8 shrink-0">
                  <Icons.pdf />
                </div>
                <h5 className="font-semibold">{removeExtension(card.attachmentFileName)}</h5>
              </Link>
            </div>
          </section>
        )}
      </div>
      <div
        className={cn(
          "sticky bottom-0 mt-auto h-20 w-full max-w-screen-sm p-4",
          card.styles?.isDarkMode ? "bg-background" : "bg-white"
        )}
      >
        <SaveContactButton
          data={card}
          imageBase64={imageBase64URI}
          style={{
            backgroundColor: theme,
            color: textColor,
          }}
        />
      </div>
    </div>
  );
}
