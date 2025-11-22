import Image from "next/image";
import Link from "next/link";

import { IconMail, IconPhone, IconPinned } from "@tabler/icons-react";

import { CardType, Company } from "@ziron/db/schema";
import { cn, getTextColorByBackground, removeExtension } from "@ziron/utils";

import { Icons } from "../assets/icons";
import SaveContactButton from "../components/save-contact-button";

interface TemplateProps {
  card?: CardType;
  company?: Company[];
  imageBase64URI?: string;
}

export default function ModernTemplate({ card, company, imageBase64URI }: TemplateProps) {
  if (!card) return null;

  const companyData = company?.find((c) => c.id === card.companyId);

  const textColor = getTextColorByBackground(card.styles?.btnColor || "#4938ff");

  const theme = card.styles?.theme || "#4938ff";
  const btnColor = card.styles?.btnColor || "#4938ff";
  return (
    <div className="relative flex @sm:h-dvh h-full w-full flex-col justify-between">
      <div
        className={cn(
          "no-scrollbar md:overflow-y-scroll",
          card.styles?.isDarkMode ? "dark bg-background text-foreground" : "bg-white text-black"
        )}
      >
        <header className="mb-9 w-full">
          <div className="relative">
            <section
              className="relative bg-primary"
              style={{
                aspectRatio: "16/9",

                maskImage:
                  "url(\"data:image/svg+xml,%3Csvg width='445' height='218' viewBox='0 0 445 218' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M222.5 179.725C80.8333 179.725 0 218 0 218V0H445V218C445 218 364.167 179.725 222.5 179.725Z' fill='%234A3AFF'/%3E%3C/svg%3E\")",
                WebkitMaskImage:
                  "url(\"data:image/svg+xml,%3Csvg width='445' height='218' viewBox='0 0 445 218' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M222.5 179.725C80.8333 179.725 0 218 0 218V0H445V218C445 218 364.167 179.725 222.5 179.725Z' fill='%234A3AFF'/%3E%3C/svg%3E\")",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskSize: "contain",
                WebkitMaskSize: "contain",
              }}
            >
              <div className="absolute top-3 z-50 flex @sm:h-32 h-24 w-full items-start justify-center bg-center bg-cover bg-no-repeat pt-4">
                {card.company && card.company.logo && (
                  <Image
                    alt="cover"
                    className="z-30 h-5 object-contain"
                    height={100}
                    src={card.company.logo}
                    width={100}
                  />
                )}
              </div>
              {card.cover && (
                <Image alt="cover" className="h-full w-full object-cover" height={218} src={card.cover} width={445} />
              )}
            </section>
            {card.image && (
              <div
                className="-translate-x-1/2 absolute top-1/2 left-1/2 @sm:size-32 size-24 overflow-hidden rounded-full border-4 bg-gray-100"
                style={{ borderColor: theme }}
              >
                <Image alt="" className="object-cover" fill sizes="20vw" src={card.image} />
              </div>
            )}
          </div>

          <section className={cn("space-y-0.5 px-8 py-4 text-center")}>
            {card.name && <h1 className="font-bold @sm:text-2xl text-xl">{card.name}</h1>}
            {card.company || companyData ? (
              <h2
                className="font-medium"
                style={{
                  color: theme,
                }}
              >
                {companyData?.name || card.company?.name}
              </h2>
            ) : null}
            {card.designation && <h2 className="@sm:text-sm text-xs">{card.designation}</h2>}
            {card.bio && <p className="text-balance @sm:text-xs text-[10px]">{card.bio}</p>}
          </section>
          <section className="mt-4 flex w-full flex-col space-y-3 px-8">
            {card.phones && (
              <Link
                className="flex @sm:h-12 h-10 w-full items-center justify-center rounded-full border-2 border-primary px-6 text-center font-semibold text-primary"
                href={`tel:${card.phones[0]?.phone}`}
                style={{
                  color: theme,
                  borderColor: theme,
                }}
              >
                Call me now!
              </Link>
            )}

            <SaveContactButton
              className="@sm:h-12 h-10 rounded-full"
              data={card}
              imageBase64={imageBase64URI}
              style={{
                backgroundColor: btnColor,
                color: textColor,
              }}
            />
          </section>
        </header>

        {card.company || card.emails || card.phones || card.address ? (
          <section className="@sm:space-y-4 space-y-3 @sm:px-8 px-4">
            <h2 className="sr-only">Contact Info</h2>

            <div className="grid grid-cols-3 gap-4">
              {card.emails &&
                card.emails.map((e, i) => (
                  <LinkBox color={theme} href={`mailto:${e.email}`} key={`${e.id}-${i}-${e.email}`}>
                    <IconMail className="@sm:size-16 size-9 shrink-0 stroke-[1.5]" />
                    <p className="sr-only">{e.email}</p>
                  </LinkBox>
                ))}
              {card.phones &&
                card.phones.map((ph, i) => (
                  <LinkBox color={theme} href={`tel:${ph.phone}`} key={`${ph.id}-${i}-${ph.phone}`}>
                    <IconPhone className="@sm:size-16 size-9 shrink-0 stroke-[1.5]" />
                    <p className="sr-only"> {ph.phone}</p>
                  </LinkBox>
                ))}
              {card.address && (
                <LinkBox color={theme} href={"#"}>
                  <IconPinned className="@sm:size-16 size-9 shrink-0 stroke-[1.5]" />
                  <p className="sr-only"> {card.address}</p>
                </LinkBox>
              )}
            </div>
          </section>
        ) : null}

        {card.links && card.links.length > 0 && (
          <section className="@sm:space-y-4 space-y-3 @sm:px-8 px-4 pb-8">
            <h2 className="sr-only">Links</h2>
            <div className="grid grid-cols-3 gap-4">
              {card.links.map((link, index) => (
                <LinkBox color={theme} href={link.url || "#"} key={`${index}-${link.label}-${link.url}`}>
                  <div className="relative @sm:size-16 size-9 shrink-0">
                    <Image alt="" fill sizes="10vw" src={link.icon} />
                  </div>
                  <h5 className="sr-only">{link.label}</h5>
                </LinkBox>
              ))}
              {card.attachmentUrl && card.attachmentFileName && (
                <LinkBox color={theme} download href={card.attachmentUrl}>
                  <Icons.pdf className="relative @sm:size-16 size-9 shrink-0" />

                  <h5 className="sr-only">{removeExtension(card.attachmentFileName)}</h5>
                </LinkBox>
              )}
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
      className="flex items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 p-5 @sm:text-base text-sm"
      download={download}
      href={href}
      style={{ borderColor: color, backgroundColor: `${color}10` }}
      target="_blank"
    >
      {children}
    </Link>
  );
};
