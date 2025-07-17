import PhoneMockup from "@/components/ui/phone-mockup";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { IconArrowsMaximize } from "@tabler/icons-react";

import { CardType, Company } from "@ziron/db/schema";
import { Card, CardContent, CardHeader } from "@ziron/ui/components/card";
import { ScrollArea } from "@ziron/ui/components/scroll-area";
import CardTemplate from "@ziron/ui/templates/card-template";
import DefaultTemplate from "@ziron/ui/templates/default-template";
import ModernTemplate from "@ziron/ui/templates/modern-template";
import { cn } from "@ziron/utils";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  cardData: CardType;
  company: Company[];
}

export const Preview = ({
  isOpen,
  closeModal,
  cardData,
  company: data,
}: Props) => {
  return (
    <Card className="bg-background @container sticky top-24 col-span-4 hidden h-fit rounded-lg md:block">
      <CardHeader className="flex-row items-center justify-between border-b py-4">
        <h5>Preview</h5>
        <ResponsiveModal
          isOpen={isOpen}
          closeModal={closeModal}
          trigger={<IconArrowsMaximize className="size-4 text-gray-600" />}
          title="Preview"
          className="max-w-sm gap-0"
        >
          <CardContent
            className={cn(
              "relative p-0",
              cardData.styles.isDarkMode ? "dark" : "light",
            )}
          >
            <ScrollArea className="h-[640px]">
              {(() => {
                switch (cardData.styles.template) {
                  case "default":
                    return <DefaultTemplate card={cardData} company={data} />;
                  case "modern":
                    return <ModernTemplate card={cardData} company={data} />;
                  case "card":
                    return <CardTemplate card={cardData} company={data} />;
                  default:
                    return <DefaultTemplate card={cardData} company={data} />;
                }
              })()}
            </ScrollArea>
          </CardContent>
        </ResponsiveModal>

        {/* <IconDots /> */}
      </CardHeader>
      <CardContent className="relative py-5">
        <PhoneMockup>
          <ScrollArea className="h-full">
            {(() => {
              switch (cardData.styles.template) {
                case "default":
                  return <DefaultTemplate card={cardData} company={data} />;
                case "modern":
                  return <ModernTemplate card={cardData} company={data} />;
                case "card":
                  return <CardTemplate card={cardData} company={data} />;
                default:
                  return <DefaultTemplate card={cardData} company={data} />;
              }
            })()}
          </ScrollArea>
        </PhoneMockup>
      </CardContent>
    </Card>
  );
};
