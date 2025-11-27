import { IconArrowsMaximize } from "@tabler/icons-react";
import { parseAsBoolean, useQueryState } from "nuqs";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@ziron/ui/components/card";
import { ScrollArea } from "@ziron/ui/components/scroll-area";
import CardTemplate from "@ziron/ui/templates/card-template";
import DefaultTemplate from "@ziron/ui/templates/default-template";
import ModernTemplate from "@ziron/ui/templates/modern-template";

import { CardType, Company } from "@ziron/db/schema";
import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

import PhoneMockup from "@/components/ui/phone-mockup";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";

interface Props {
  companies?: Company[];
  cardData: Partial<zCardSchema>;
}

export const Preview = ({ companies, cardData }: Props) => {
  const [preview, setPreview] = useQueryState("preview", parseAsBoolean.withDefault(false));
  // const form = useFormContext<zCardSchema>();
  // const cardData = form.watch();

  // Find the selected company based on cardData.companyId
  const company = companies?.filter((c) => c.id === cardData.companyId);

  // Transform cardData to match CardType structure (appearance -> styles)
  const transformedCardData = cardData
    ? ({
        ...cardData,
        styles: cardData.appearance
          ? {
              template: cardData.appearance.template,
              theme: cardData.appearance.theme,
              btnColor: cardData.appearance.btnColor,
              isDarkMode: cardData.appearance.isDarkMode,
            }
          : undefined,
      } as Partial<CardType>)
    : undefined;

  return (
    <Card className="@container sticky top-24 col-span-1 mt-6 hidden h-fit rounded-lg bg-background py-6 md:block">
      <CardHeader className="border-b">
        <CardTitle>Preview</CardTitle>
        <CardAction className="row-span-1">
          <ResponsiveModal onOpenChange={(open) => setPreview(open ?? false)} open={preview}>
            <ResponsiveModalTrigger asChild>
              <IconArrowsMaximize className="size-4 cursor-pointer text-gray-600" />
            </ResponsiveModalTrigger>
            <ResponsiveModalContent className="max-w-sm gap-0">
              <ResponsiveModalHeader>
                <ResponsiveModalTitle>Preview</ResponsiveModalTitle>
              </ResponsiveModalHeader>
              <CardContent className={cn("relative p-0", cardData.appearance?.isDarkMode ? "dark" : "light")}>
                <ScrollArea className="h-[640px]">
                  {(() => {
                    switch (cardData.appearance?.template) {
                      case "default":
                        return <DefaultTemplate card={transformedCardData} company={company} />;
                      case "modern":
                        return <ModernTemplate card={transformedCardData} company={company} />;
                      case "card":
                        return <CardTemplate card={transformedCardData} company={company} />;
                      default:
                        return <DefaultTemplate card={transformedCardData} company={company} />;
                    }
                  })()}
                </ScrollArea>
              </CardContent>
            </ResponsiveModalContent>
          </ResponsiveModal>
        </CardAction>
      </CardHeader>
      <CardContent className="relative py-5">
        <PhoneMockup>
          <ScrollArea className="h-full">
            {(() => {
              switch (cardData.appearance?.template) {
                case "default":
                  return <DefaultTemplate card={transformedCardData} company={company} />;
                case "modern":
                  return <ModernTemplate card={transformedCardData} company={company} />;
                case "card":
                  return <CardTemplate card={transformedCardData} company={company} />;
                default:
                  return <DefaultTemplate card={transformedCardData} company={company} />;
              }
            })()}
          </ScrollArea>
        </PhoneMockup>
      </CardContent>
    </Card>
  );
};
