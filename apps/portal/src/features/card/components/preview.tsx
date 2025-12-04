import { IconArrowsMaximize } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsBoolean, useQueryState } from "nuqs";

import { Card, CardAction, CardContent, CardHeader } from "@ziron/ui/components/card";
import { ScrollArea } from "@ziron/ui/components/scroll-area";
import CardTemplate from "@ziron/ui/templates/card-template";
import DefaultTemplate from "@ziron/ui/templates/default-template";
import ModernTemplate from "@ziron/ui/templates/modern-template";

import { CardType } from "@ziron/db/schema";
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

import { orpc } from "@/lib/orpc/client";

interface Props {
  // companies?: Company[];
  cardData: Partial<zCardSchema>;
}

export const Preview = ({ cardData }: Props) => {
  const [preview, setPreview] = useQueryState("preview", parseAsBoolean.withDefault(false));
  // const form = useFormContext<zCardSchema>();
  // const cardData = form.watch();

  // Find the selected company based on cardData.companyId
  const { data: organization } = useSuspenseQuery(
    orpc.organization.get.queryOptions({ input: { id: cardData.organizationId } })
  );

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
    <Card className="@container hidden aspect-5/4 h-fit overflow-hidden rounded-lg bg-background lg:block lg:aspect-4/3 xl:aspect-3/4">
      <CardHeader>
        <CardAction className="row-span-1">
          <ResponsiveModal onOpenChange={(open) => setPreview(open ?? false)} open={preview}>
            <ResponsiveModalTrigger asChild>
              <IconArrowsMaximize className="size-4 cursor-pointer text-gray-600" />
            </ResponsiveModalTrigger>
            <ResponsiveModalContent className="max-w-sm gap-0">
              <ResponsiveModalHeader>
                <ResponsiveModalTitle>Preview</ResponsiveModalTitle>
              </ResponsiveModalHeader>
              <CardContent className={cn("relative p-0 px-0", cardData.appearance?.isDarkMode ? "dark" : "light")}>
                <ScrollArea className="h-[640px]">
                  {(() => {
                    switch (cardData.appearance?.template) {
                      case "default":
                        return <DefaultTemplate card={transformedCardData} organization={organization} />;
                      case "modern":
                        return <ModernTemplate card={transformedCardData} organization={organization} />;
                      case "card":
                        return <CardTemplate card={transformedCardData} organization={organization} />;
                      default:
                        return <DefaultTemplate card={transformedCardData} organization={organization} />;
                    }
                  })()}
                </ScrollArea>
              </CardContent>
            </ResponsiveModalContent>
          </ResponsiveModal>
        </CardAction>
      </CardHeader>
      <CardContent className="relative px-0">
        <PhoneMockup>
          <ScrollArea className="h-full">
            {(() => {
              switch (cardData.appearance?.template) {
                case "default":
                  return <DefaultTemplate card={transformedCardData} organization={organization} />;
                case "modern":
                  return <ModernTemplate card={transformedCardData} organization={organization} />;
                case "card":
                  return <CardTemplate card={transformedCardData} organization={organization} />;
                default:
                  return <DefaultTemplate card={transformedCardData} organization={organization} />;
              }
            })()}
          </ScrollArea>
        </PhoneMockup>
      </CardContent>
    </Card>
  );
};
