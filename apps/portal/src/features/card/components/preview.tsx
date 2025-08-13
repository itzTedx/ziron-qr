import PhoneMockup from "@/components/ui/phone-mockup";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { IconArrowsMaximize } from "@tabler/icons-react";
import { useQueryState } from "nuqs";
import { useFormContext } from "react-hook-form";

import { Company } from "@ziron/db/schema";
import { Card, CardContent, CardHeader } from "@ziron/ui/components/card";
import { ScrollArea } from "@ziron/ui/components/scroll-area";
import CardTemplate from "@ziron/ui/templates/card-template";
import DefaultTemplate from "@ziron/ui/templates/default-template";
import ModernTemplate from "@ziron/ui/templates/modern-template";
import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

interface Props {
  companies: Company[];
  cardData: zCardSchema;
}

export const Preview = ({ companies, cardData }: Props) => {
  const [preview, setPreview] = useQueryState("preview");
  const form = useFormContext<zCardSchema>();
  // const cardData = form.watch();

  // Find the selected company based on cardData.companyId
  const company = companies.filter((c) => c.id === cardData.companyId);

  return (
    <Card className="bg-background @container sticky top-24 col-span-1 hidden h-fit rounded-lg md:block">
      <CardHeader className="flex-row items-center justify-between border-b py-4">
        <h5>Preview</h5>
        <ResponsiveModal
          isOpen={preview === "open"}
          closeModal={() => setPreview(null)}
          trigger={
            <IconArrowsMaximize
              className="size-4 cursor-pointer text-gray-600"
              onClick={() => setPreview("open")}
            />
          }
          title="Preview"
          className="max-w-sm gap-0"
        >
          <CardContent
            className={cn(
              "relative p-0",
              cardData.appearance?.isDarkMode ? "dark" : "light",
            )}
          >
            <ScrollArea className="h-[640px]">
              {(() => {
                switch (cardData.appearance?.template) {
                  case "default":
                    return (
                      <DefaultTemplate card={cardData} company={company} />
                    );
                  case "modern":
                    return <ModernTemplate card={cardData} company={company} />;
                  case "card":
                    return <CardTemplate card={cardData} company={company} />;
                  default:
                    return (
                      <DefaultTemplate card={cardData} company={company} />
                    );
                }
              })()}
            </ScrollArea>
          </CardContent>
        </ResponsiveModal>
      </CardHeader>
      <CardContent className="relative py-5">
        <PhoneMockup>
          <ScrollArea className="h-full">
            {(() => {
              switch (cardData.appearance?.template) {
                case "default":
                  return <DefaultTemplate card={cardData} company={company} />;
                case "modern":
                  return <ModernTemplate card={cardData} company={company} />;
                case "card":
                  return <CardTemplate card={cardData} company={company} />;
                default:
                  return <DefaultTemplate card={cardData} company={company} />;
              }
            })()}
          </ScrollArea>
        </PhoneMockup>
      </CardContent>
    </Card>
  );
};
