import Image from "next/image";
import Link from "next/link";

import { IconBuildingSkyscraper, IconMail, IconPhone, IconPinned } from "@tabler/icons-react";

import { CardType, Company } from "@ziron/db/schema";
import { cn, getTextColorByBackground, removeExtension } from "@ziron/utils";

import SaveContactButton from "../components/save-contact-button";

interface TemplateProps {
  card?: Partial<CardType>;
  company?: Company[];
  imageBase64URI?: string;
}

export default function CardTemplate({ card, company, imageBase64URI }: TemplateProps) {
  if (!card) return null;

  const companyData = company?.find((c) => c.id === card.companyId);

  const textColor = getTextColorByBackground(card.appearance?.theme || "#4938ff");
  const btnTextColor = getTextColorByBackground(card.appearance?.btnColor || "#4938ff");

  const theme = card.appearance?.theme || "#4938ff";
  const btnColor = card.appearance?.btnColor || "#4938ff";

  return (
    <div className="relative flex h-full @sm:max-h-[700px] w-full flex-col justify-between">
      <div
        className={cn(
          "no-scrollbar pb-6",
          card.appearance?.isDarkMode ? "dark bg-background text-foreground" : "bg-white text-black"
        )}
      >
        <header className="w-full">
          <div className="relative w-full">
            <div className="relative h-40">
              <Image
                alt={`${card.name}'s cover`}
                className="object-cover"
                fill
                sizes="100vw"
                src={card.cover ? card.cover : "/images/placeholder-cover.jpg"}
              />
            </div>

            <section
              className="absolute @sm:inset-x-6 inset-x-4 top-16 z-10 rounded-md border border-background @sm:px-6 px-4 py-4"
              style={{
                backgroundColor: theme,
                color: textColor,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  {card.name && <h1 className="font-bold @sm:text-2xl text-xl">{card.name}</h1>}
                  {card.designation && <h2 className="@sm:text-sm text-xs">{card.designation}</h2>}
                </div>
                {card.image && (
                  <div className="relative @sm:size-24 size-16 overflow-hidden rounded-full border-4 border-background bg-gray-100">
                    <Image alt="" className="object-cover" fill src={card.image} />
                  </div>
                )}
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="mt-3 space-y-1.5">
                  {card.emails &&
                    card.emails.map((email, i) => (
                      <Link
                        className="flex items-center gap-2 @sm:text-base text-xs"
                        href={`mailto:${email.email}`}
                        key={`${i + 1}-${email.email}`}
                      >
                        <IconMail className="@sm:size-5 size-4 shrink-0 stroke-[1.5]" />
                        {email.email}
                      </Link>
                    ))}
                  {card.phones &&
                    card.phones.map((phone, i) => (
                      <Link
                        className="flex items-center gap-2 @sm:text-base text-xs"
                        href={`tel:${phone.phone}`}
                        key={`${i + 1}-${phone.phone}`}
                      >
                        <IconPhone className="@sm:size-5 size-4 shrink-0 stroke-[1.5]" />
                        {phone.phone}
                      </Link>
                    ))}
                </div>
                {card.company && card.company.logo && (
                  <Image
                    alt="cover"
                    className="z-30 h-5 object-contain"
                    height={100}
                    src={card.company.logo}
                    width={80}
                  />
                )}
              </div>
            </section>
          </div>
          <section className={cn("@sm:mt-24 mt-12 flex flex-col items-center gap-y-3 px-6 py-4")}>
            {card.links && card.links.length > 0 && (
              <div className="flex @sm:gap-4 gap-2">
                {card.links.map((link, index) => (
                  <LinkBox color={theme} href={link.url || "#"} key={`${index}-${link.label}-${link.url}`}>
                    <div className="relative @sm:size-9 size-7 shrink-0">
                      <Image alt="" fill sizes="10vw" src={link.icon} />
                    </div>
                    <h5 className="sr-only">{link.label}</h5>
                  </LinkBox>
                ))}
              </div>
            )}

            <div className="w-full">
              <SaveContactButton
                data={card}
                imageBase64={imageBase64URI}
                style={{
                  backgroundColor: btnColor,
                  color: btnTextColor,
                }}
              />
            </div>
            {card.bio && <p className="w-full text-balance @sm:text-xs text-[10px]">{card.bio}</p>}
          </section>
        </header>

        {card.company || card.emails || card.phones || card.address ? (
          <section className="@sm:px-6 px-4 @sm:py-4 py-3">
            <h2 className="pb-3 font-medium @sm:text-sm text-gray-600 text-xs">Contact Info</h2>

            <div className="@sm:space-y-4 space-y-3">
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

              {card.address && (
                <Link className="flex items-start gap-2 @sm:text-base text-sm" href={"#"}>
                  <IconPinned className="mt-1.5 @sm:size-5 size-4 shrink-0 stroke-[1.5]" />
                  {card.address}
                </Link>
              )}
            </div>
          </section>
        ) : null}

        {card.attachmentUrl && card.attachmentFileName && (
          <section className="@sm:space-y-4 space-y-3 @sm:px-6 px-4">
            <h2 className="pt-3 font-medium text-gray-600 text-sm">Attachment</h2>
            <div className="space-y-4">
              <Link
                className="flex items-center gap-2 rounded-md border p-3 @sm:text-base text-sm"
                download
                href={card.attachmentUrl}
                style={{
                  borderColor: btnColor,
                  color: btnColor,
                }}
              >
                <h5 className="font-semibold">{removeExtension(card.attachmentFileName)}</h5>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const LinkBox = ({
  href,
  download,
  color,
  children,
}: {
  href: string;
  download?: boolean;
  color: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      className="flex @sm:size-14 size-10 items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 @sm:text-base text-sm"
      download={download}
      href={href}
      style={{ borderColor: color, backgroundColor: `${color}10` }}
      target="_blank"
    >
      {children}
    </Link>
  );
};
